const {Client} = require("basic-ftp")
const fs = require('fs');
const { logger } = require('../utils/logger');
const { replaceTextContent } = require('../scripts/addMessagesToPDF');
require('dotenv').config({
    path: '../.env'
})

const host = process.env.FTP_HOST;
const user = process.env.FTP_USER;
const password = process.env.FTP_PASSWORD;
const remoteDir = process.env.REMOTE_DIRECTORY

const pathToScanTimeFile =   '/../public/pdf/LASTSCAN';

//create file if not there

if (!checkFileExists(pathToScanTimeFile)) {
    createFile(__dirname + pathToScanTimeFile, '')
    logger.info("File Not found")
}


exports.index = function () {
    logger.info(`Host: ${process.env.FTP_HOST} `);
}



const scanDir = async function () {
    const client = new Client();
    let lastScanTime = await readOrCreateFile(__dirname + pathToScanTimeFile);

    logger.info(`Last scan time: ${lastScanTime}`)
    try {
        await client.access({
            host, user: user, password,
        });

        console.log('Connected to FTP server');

        const scannedDate = new Date();
        const files = await client.list(remoteDir);

        // Filter for PDF files
        const pdfFiles = files.filter((file) => file.type === 1 && file.name.toLowerCase().endsWith('.pdf'));

        // Identify new PDFs by comparing modification times with last scan
        const newlyAdded = pdfFiles.filter((file) => {
            const fileModifiedTime = new Date(file.modifiedAt);
            return !lastScanTime || fileModifiedTime > lastScanTime;
        });

        if (newlyAdded.length > 0) {
            console.log(`${newlyAdded.length} New PDFs found:`);
            for (const file of newlyAdded) {

                await downloadFileAndJson(file, client)

                //get json content
                const json = await readJsonFile(__dirname + '/../public/pdf/' + getPdfJson(file.name))

                //log content
                logger.info(json['size'])

                //load file content in object
                const jsonData = getJsonInfo(json);

                //create the Current file and save the filename in it
                createFile(__dirname + '/../public/pdf/CURRENT', file.name)


                //perform action on temp file
                const currentFilePath = __dirname + '/../public/pdf/' + file.name;


                //delete current file
                await deleteFile(__dirname + '/../public/CURRENT');
                
                //upload to archive folder on ftp and delete
                await uploadFiles(file, client, '/archive')

                //remove pdf and json files from local
                await deleteFile(__dirname + '/../public/pdf/' + file.name);
                await deleteFile(__dirname + '/../public/pdf/' + getPdfJson(file.name));
            }
        } else {
            console.log('No new PDFs found.');
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
                throw err; // Re-throw the error for handling in the catch block
            } else {
                console.log(`File "${fileName}" created successfully!`);
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
            console.log(`File "${fileName}" deleted successfully!`);
        });
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

async function downloadFileAndJson(file, client) {
    try {
        // Download the file
        await client.downloadTo(__dirname + '/../public/pdf/' + file.name, file.name)
            .catch((error) => {
                console.error("Error downloading file:", error);
                // Handle file download failure (e.g., notify user, retry, etc.)
                throw error; // Re-throw to prevent JSON download attempt
            });

        // Download its JSON
        await client.downloadTo(__dirname + '/../public/pdf/' + getPdfJson(file.name), getPdfJson(file.name))
            .catch((error) => {
                logger.error("Error downloading JSON:", error);
                // Handle JSON download failure (e.g., log error, retry, etc.)
            });

        console.log("File and JSON downloaded successfully!");
    } catch (error) {
        logger.error("An error occurred:", error);
        // Handle general errors (e.g., log error, notify user, etc.)
    }
}

async function uploadFiles(file, client, destination) {
    try {
        await client.ensureDir(destination)
        await client.uploadFrom(__dirname + '/../public/pdf/' + file.name, destination)
            .then(() => logger.info(`${file.name} successfully added to archive folder`))
            .catch(e => logger.error(`Error adding ${file.name} to archive on remote ===> ${e}`));
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
            await fs.promises.writeFile(filePath, '', 'utf8');
            return '';
        } else {
            throw error;
        }
    }
}

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath, function () {
            console.log("Files Created")
            return true;
        });

    } catch (error) {
        console.log("Files Not Found")
        return false;
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


scanDir().catch(e => console.error(e));