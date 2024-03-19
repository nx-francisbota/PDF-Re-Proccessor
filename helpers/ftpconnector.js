const { Client } = require("basic-ftp")
const fs = require('fs');
const path = require('path');
const {logger} = require('../utils/logger');
const { replaceTextContent } = require('../scripts/addMessagesToPDF');
require('dotenv').config({
    path: '../.env'
})

const host = process.env.FTP_HOST;
const user = process.env.FTP_USER;
const password = process.env.FTP_PASSWORD;
const remoteDir = process.env.REMOTE_DIRECTORY
const pathToArchiveDir = '/archive'
const pathToScanTimeFile = '/../public/pdf/LASTSCAN';
const pathToLocalDir = '/../public/pdf/';
const pathToCurrentFile = '/../public/pdf/CURRENT';


const scanDir = async function () {
    const client = new Client();

    let lastScanTime = await readOrCreateFile(__dirname + pathToScanTimeFile)

    logger.info(`Last scan time: ${lastScanTime}`)
    try {
        await client.access({
            host, user: user, password,
        });

        logger.info('Connected to FTP server');

        const scannedDate = new Date();
        const files = await client.list(remoteDir);

        // Filter for PDF files
        const pdfFiles = files.filter((file) => file.type === 1 && file.name.toLowerCase().endsWith('.pdf'));

        // Identify new PDFs by comparing modification times with last scan
        const newlyAdded = pdfFiles.filter((file) => {
            const fileModifiedTime = new Date(file.modifiedAt);
            return lastScanTime === "" || fileModifiedTime > lastScanTime;
        });

        if (newlyAdded.length > 0) {
             logger.info(`${newlyAdded.length} New PDFs found:`);
            for (const file of newlyAdded) {

                await downloadFileAndJson(file, client)

                //get json content

                const json = await readJsonFile(__dirname + pathToLocalDir + getPdfJson(file.name))


                //log content
                logger.info(json['size'])

                //load file content in object
                const jsonData = getJsonInfo(json);

                //create the Current file and save the filename in it
                createFile(__dirname + pathToCurrentFile, file.name)


                //perform action on temp file
                const currentFilePath = __dirname + pathToLocalDir + file.name;
                const fixedFiles = await replaceTextContent(jsonData, currentFilePath)

                if (!fixedFiles) {
                    continue;
                }

                if (fixedFiles.length > 0) {
                    await client.ensureDir('/output');
                    for (const filePath of fixedFiles) {
                        const filename = path.basename(filePath);
                        console.log(`Uploading file at ${filePath}`);

                        await client.uploadFrom(filePath, filename);
                    }
                    await client.cd('../');
                    fixedFiles.map((file) => deleteFile(file));
                }

                //delete current file
                await deleteFile(__dirname + '/../public/CURRENT');

                //remove pdf and json files from local
                await deleteFile(__dirname + '/../public/pdf/' + file.name);
                await deleteFile(__dirname + '/../public/pdf/' + getPdfJson(file.name));
            }
        } else {
             logger.info('No new PDFs found.');
        }
        // Update last scan time for future comparisons
        await createFile(__dirname + pathToScanTimeFile, scannedDate.toString())
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}


function getPdfJson(fileName) {
    const name = fileName.slice(0, -4);
    return name + '.json'
}

function createFile(fileName, content) {
    try {
        fs.writeFile(fileName, content, (err) => {
            if (err) {
                throw err;
            } else {
                 logger.info(`File "${fileName}" created successfully!`);
            }
        });
    } catch (error) {
        console.error('Error creating file:', error);
        // Handle other errors here (e.g., logging to a file, notifying the user)
    }
}

async function deleteFile(fileName) {
    try {
        await fs.unlink(fileName, () => {
             logger.info(`File "${fileName}" deleted successfully!`);
        });
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

async function downloadFileAndJson(file, client) {
    try {
        // Download the file
        await client.downloadTo(__dirname + pathToLocalDir + file.name, file.name)

            .catch((error) => {
                console.error("Error downloading file:", error);
                // Handle file download failure (e.g., notify user, retry, etc.)
                throw error;
            });

        // Download its JSON

        await client.downloadTo(__dirname + pathToLocalDir + getPdfJson(file.name), getPdfJson(file.name))

            .catch((error) => {
                logger.error("Error downloading JSON:", error);
                // Handle JSON download failure (e.g., log error, retry, etc.)
            });

         logger.info("File and JSON downloaded successfully!");
    } catch (error) {
        logger.error("An error occurred:", error);
        // Handle general errors (e.g., log error, notify user, etc.)
    }
}

async function uploadFiles(fileName, client, destination) {
    try {
        await client.ensureDir(destination);

        await client.uploadFrom(__dirname + '/../public/pdf/' + fileName, destination)
            .then(() => logger.info(`${fileName} successfully added to output folder`))
            .catch(e => logger.error(`Error adding ${fileName} to archive on remote ===> ${e}`));

    } catch (e) {
        console.error(`An error occurred: ${e}`);
    }
}

async function readJsonFile(filePath) {
    try {
        const data = readFile(filePath)
        return JSON.parse(await data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: File '${filePath}' not found.`);
            // Handle file not found error (e.g., send a 404 response)
            return null;
        } else if (error.name === 'SyntaxError') {
            console.error(`Error: Failed to parse '${filePath}' as JSON.`);
            // Handle invalid JSON error (e.g., send a 500 response)
            return null;
        } else {
            console.error('Unexpected error:', error);
            // Handle other errors
            return null;
        }
    }
}


async function readFile(filePath) {
    return await fs.promises.readFile(filePath, 'utf8'); // Asynchronous reading
}

async function readOrCreateFile(filePath) {
    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            logger.info(`File not found. Creating it at ${filePath}`);
            await fs.promises.writeFile(filePath, '', 'utf8');
            return '';
        } else {
            throw error;
        }
    }
}



/**
 * @param jsonObject string
 */
const getJsonInfo = (jsonObject) => {
    const integrationData = {};
    if (!jsonObject) {
        console.error("Invalid or null json file read");
        return;
    }
    if (jsonObject.titleText) {
        integrationData.titleText = jsonObject.titleText;
    }
    integrationData.size = jsonObject.size;
    if (jsonObject.productNumber) {
        integrationData.productNumber = jsonObject.productNumber;
    }
    if (jsonObject.orderNumber) {
        integrationData.orderNumber = jsonObject.orderNumber;
    }
    if (jsonObject.quantity) {
        integrationData.quantity = jsonObject.quantity;
    }
    if (jsonObject.printId) {
        integrationData.guid = jsonObject.printId;
    }
    return integrationData;
}

scanDir().then(() => console.log("done scanning")).catch(e => console.error(e));