#!/bin/bash
echo "=== OpenWA Startup ==="
echo "Starting API on localhost:2785..."
cd /app
node dist/main.js &
echo "Waiting 15s for API to initialize..."
sleep 15
echo "Starting nginx on port 80..."
exec nginx -g "daemon off;"
