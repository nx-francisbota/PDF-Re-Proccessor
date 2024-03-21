#!/bin/bash

source .env
echo "Environment variable file detected. Reading variables"

SERVER_HOST=${HOST}
SERVER_PORT=${PORT}

if [[ ! -z "$SERVER_HOST" && ! -z "$SERVER_PORT" ]]; then
  echo "SERVER_HOST and SERVER_PORT found"
else
  echo "SERVER_HOST is not defined"
fi

SERVER_URL="$SERVER_HOST:$SERVER_PORT/ftp"

echo "Server URL: $SERVER_URL"

# Make a GET request to the /ftp route to trigger the process
curl -X GET "$SERVER_URL"

# Log the execution time
START_TIME=$(date +%s)
curl -X GET "$SERVER_URL"
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo "Script execution time: $ELAPSED seconds"
