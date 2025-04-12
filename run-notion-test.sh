#!/bin/bash

# Start 360 Business Magician API Server with Notion Integration
# and serve the test HTML page

echo "Starting 360 Business Magician API Server with Notion integration..."
echo "Access the test page at: http://localhost:5000/notion-test.html"

# Create a directory for static files if it doesn't exist
mkdir -p client/dist

# Copy the test HTML file to the static directory
cp notion-test.html client/dist/

# Run the API server with Notion integration
node api-server-notion.js