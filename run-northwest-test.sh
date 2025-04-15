#!/bin/bash

# Northwest Agent API Test Server
echo "Starting Northwest Agent API Test Server..."
echo "This server focuses solely on Northwest Registered Agent API integration"
echo "You will act as the client-facing representative while Northwest handles the actual work"

# Set API mode to mock by default if no key is present
if [ -z "$NORTHWEST_API_KEY" ]; then
  echo "NORTHWEST_API_KEY not found, running in mock mode"
  export API_MODE="mock"
else
  echo "NORTHWEST_API_KEY configured, running in live mode"
  export API_MODE="live"
fi

node northwest-api-test.js