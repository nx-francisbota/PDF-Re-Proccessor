# Installation

This document guides you through installing and configuring the pdf-re-processor on a Linux server.

## Prerequisites:
Linux server with SSH access
Node.js (version 20.5.1 or later) and npm installed (refer to https://nodejs.org/en/download for installation instructions)
`unzip` command installed on the server (check with unzip -v)

## Steps:
1. Transfer the ArchiveL Upload the zipped application archive (PDF-Re-Processor.zip) to the desired location on the server using tools like scp or SFTP clients.

2. Unzip the archive:
   `unzip PDF-Re-Processor.zip`

3. Navigate to the application directory.
   `cd PDF-Re-Processor`

4. Install project dependencies using npm:
   `npm install`


## Configuration
The application should have a configuration file in it's root, .env, that defines environment variables for the /ftp endpoint and other functionalities. Edit this file according to your setup, providing the following details:

HOST=
PORT=
FTP_PORT=
FTP_HOST=
FTP_USER=
FTP_PASSWORD=
REMOTE_DIRECTORY=

## Starting the Application

### Development
1. Navigate to your application directory:
   `cd <app-directory>`
2. `npm start`
3. Trigger Scan: `./run_ftp_endpoint.sh`


### Production
Note: The scan will NOT begin immediately when running manually. You need to run a separate script to trigger the scan.
1. sudo npm install pm2 -g
2. Navigate to your application directory:
      `cd <app-directory>`
3. `npm start`
4. Trigger Scan: `./run_ftp_endpoint.sh`


## Setting Up a CRON Job (optional)

Create a CRON Script:

There is a shell script (e.g., run_ftp_endpoint.sh) in the application directory with the following content:

## Navigate to your application directory (adjust if needed)
`cd /path/to/PDF-Re-Processor`

## Run your Node.js application
`npm start`

## Make the script executable:
`chmod +x run_ftp_endpoint.sh`


### Schedule the CRON Job:

Edit the system's crontab using crontab -e.
Add a new line specifying the schedule and script to run. Here's an example to run the script every minute:

`* * * * * /path_to/PDF-Re-Processor/run_ftp_endpoint.sh`
Adjust the schedule (* * * * *) according to your desired frequency (e.g., 0 0 * * * for daily at midnight).
Save and exit the crontab editor.
