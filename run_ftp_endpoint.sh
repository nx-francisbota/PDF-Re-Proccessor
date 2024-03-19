#!/bin/bash

SERVER_HOST=${HOST}
SERVER_PORT=${PORT}

SERVER_URL="$SERVER_HOST:$SERVER_PORT/ftp"

# Make a GET request to the /ftp route to trigger the process
curl -X GET "$SERVER_URL"

# Log the execution time
START_TIME=$(date +%s)
curl -X GET "$SERVER_URL"
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo "Script execution time: $ELAPSED seconds"
