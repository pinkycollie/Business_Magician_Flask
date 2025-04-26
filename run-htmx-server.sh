#!/bin/bash

# HTMX server startup script
echo "Starting 360 Magicians HTMX Server with WebSockets..."

# Create necessary directories
mkdir -p views
mkdir -p public

# Check if the server is running
if lsof -i:5000 > /dev/null 2>&1; then
  echo "Port 5000 is already in use. Killing the process..."
  # Find and kill the process using port 5000
  kill $(lsof -t -i:5000) || echo "Failed to kill the process."
  # Wait a bit
  sleep 2
fi

# Start the ultra-minimal server
node server/ultra-minimal.js