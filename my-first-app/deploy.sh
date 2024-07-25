#!/bin/bash

# Variables
OWNER=holadmex
REPO=flask-example
PR_NUMBER=
SERVER_IP="localhost"
DOCKER_IMAGE="testing:${PR_NUMBER}"
PORT=$(shuf -i 2000-65000 -n 1)  # Get a random port

# Directory for the repository clone
CLONE_DIR="/tmp/${holadmex}_${flask-example}_${PR_NUMBER}"

# Clone the repository and checkout the pull request branch
git clone https://github.com/${OWNER}/${REPO}.git $CLONE_DIR
cd $CLONE_DIR
git fetch origin pull/${PR_NUMBER}/head:pr-${PR_NUMBER}
git checkout pr-${PR_NUMBER}

# Build the Docker image
docker build -t $DOCKER_IMAGE .

# Run the Docker container
docker run -d -p ${PORT}:80 $DOCKER_IMAGE

# Output the deployment URL
echo "http://${SERVER_IP}:${PORT}"

# Cleanup
cd /
rm -rf $CLONE_DIR
