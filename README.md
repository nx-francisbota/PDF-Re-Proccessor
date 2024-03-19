# Installation

This document guides you through installing and configuring the pdf-re-processor application on a Linux server.

## Prerequisites:

Linux server with SSH access
Node.js (version 20.5.1 or later) and npm (or yarn) installed (refer to https://nodejs.org/en/download for installation instructions)

## Steps:

1. Clone or Download the Repository:

If using Git:
`git clone https://github.com/nx-francisbota/PDF-Re-Proccessor.git your-app-directory`

If downloading a compressed archive:
1. Download the archive file (e.g., PDF-Re-Processor.tar.gz).
2. Transfer the archive to your server using scp or another method.
3. Unpack the archive:

Bash
`tar -xvf your-app.tar.gz`

## Install Dependencies:

Navigate to your application directory:

`cd your-app-directory`

Install project dependencies using npm:
`npm install`

## Configuration
The application should have a configuration file in it's root, .env, that defines environment variables for the /ftp endpoint and other functionalities. Edit this file according to your setup, providing the following details:


HOST=
NODE_ENV=
FTP_PORT=
FTP_HOST=
FTP_USER=admin
FTP_PASSWORD=password
REMOTE_DIRECTORY=/


## Setting Up a CRON Job

Create a CRON Script:

There is a shell script (e.g., run_ftp_endpoint.sh) in the application directory with the following content:

`#!/bin/bash`


## Navigate to your application directory (adjust if needed)
`cd /path/to/your/app/directory`


## Run your Node.js application
`npm start` 


## Make the script executable:
`chmod +x run_ftp_endpoint.sh`



### Schedule the CRON Job:

Edit the system's crontab using crontab -e.
Add a new line specifying the schedule and script to run. Here's an example to run the script every minute:

`* * * * * /application_directory/run_ftp_endpoint.sh`
          Adjust the schedule (* * * * *) according to your desired frequency (e.g., 0 0 * * * for daily at midnight).
          Save and exit the crontab editor.



## Starting the Application

Run the Application Manually:

1. Navigate to your application directory:
2. `cd your-app-directory`
3. `npm start`
