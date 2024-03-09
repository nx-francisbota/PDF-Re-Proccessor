const { Client } = require("basic-ftp")
const pino = require('pino');
const logger = pino({});
require('dotenv').config();

connect().then((data) => console.log(data)).catch((e) => console.error(e));

async function connect() {
    const client = new Client()
    client.ftp.verbose = true
    try {
        const ftpResponse = await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false,
        })
        if (ftpResponse >= 300) {
            logger.error("Failed to connect to FTP Server...Closing connection");
            client.close()
            return
        }
        return client;
    }
    catch(err) {
        logger.error(err)
        throw err;
    }
}