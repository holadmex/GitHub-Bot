#!/bin/bash

# Variables
OWNER=holadmex
REPO=flask-example
PR_NUMBER=

# Stop and remove Docker container and image associated with the PR
CONTAINER_ID=$(docker ps -q --filter ancestor=your_docker_image:${PR_NUMBER})
if [ ! -z "$CONTAINER_ID" ]; then
  docker stop $CONTAINER_ID
  docker rm $CONTAINER_ID
fi

# Remove Docker image
docker rmi your_docker_image:${PR_NUMBER}
