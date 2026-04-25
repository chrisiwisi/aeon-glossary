#!/bin/bash

# Bring down any running docker-compose services
echo "Stopping and removing docker-compose services..."
docker-compose down

# Update the codebase from the git repository
echo "Pulling the latest code from the repository..."
git pull

# Build the Docker image with the specified tag
echo "Building the Docker image..."
docker build -t todlicherTeddy/aion-glossary:latest .

# Start up the docker-compose services in detached mode
echo "Starting docker-compose services..."
docker-compose up -d

echo "Done."