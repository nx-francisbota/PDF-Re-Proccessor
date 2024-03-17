const {Client} = require("basic-ftp")
const fs = require('fs');

const host = '127.0.0.1';
const user = 'kofi';
const password = 'master';
const remoteDir = '/';

const pathToScanTimeFile = __dirname + '/../public/pdff/LASTSCANN';

//create file if not there

if (!checkFileExists(pathToScanTimeFile)) {
    console.log("file Not there")
    // createFile(pathToScanTimeFile, '')
}


exports.index = function () {
    console.log("Host: ", process.env.FTP_HOST)
}

exports.scanDir = async function () {
    const client = new Client();
    let lastScanTime = await readFile(pathToScanTimeFile);

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
            console.log('New PDFs found:');
            for (const file of newlyAdded) {
                console.log(file.name);

                // //download the file and get the temp path
                // await client.downloadTo(__dirname + '/../public/' + file.name, file.name)
                //
                // //download its json
                // await client.downloadTo(__dirname + '/../public/' + getPdfJson(file.name) , getPdfJson(file.name))

                await downloadFileAndJson(file, client)

                //get json content

                const json = await readJsonFile(__dirname + '/../public/pdff/' + getPdfJson(file.name))

                //log content
                console.log(json['size'])

                //create the Current file and save the filename in it
                createFile(__dirname + '/../public/pdff/CURRENT', file.name)


                //perform action on temp file
                const currentFilePath = __dirname + '/../public/' + file.name;
                //TODO: do your pdf action here

                //delete current file
                await deleteFile(__dirname + '/../public/CURRENT');


                console.log(`Processing new PDF: ${file.name}`);
            }
        } else {
            console.log('No new PDFs found.');
        }

        // Update last scan time for future comparisons
        createFile(pathToScanTimeFile, scannedDate)
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
    fs.writeFile(fileName, content, (err) => {
        if (err) {
            console.error('Error creating file:', err);
        } else {
            console.log(`File "${fileName}" created successfully!`);
        }
    });
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
        await client.downloadTo(__dirname + '/../public/pdff/' + file.name, file.name)
            .catch((error) => {
                console.error("Error downloading file:", error);
                // Handle file download failure (e.g., notify user, retry, etc.)
                throw error; // Re-throw to prevent JSON download attempt
            });

        // Download its JSON
        await client.downloadTo(__dirname + '/../public/pdff/' + getPdfJson(file.name), getPdfJson(file.name))
            .catch((error) => {
                console.error("Error downloading JSON:", error);
                // Handle JSON download failure (e.g., log error, retry, etc.)
            });

        console.log("File and JSON downloaded successfully!");
    } catch (error) {
        console.error("An error occurred:", error);
        // Handle general errors (e.g., log error, notify user, etc.)
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

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath, function () {
            return true;
        }); // Check file existence

    } catch (error) {
        return false; // File not found or other error
    }
}