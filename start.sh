#!/bin/bash
set -e

echo "Starting OpenWA API on localhost:2785..."
cd /app
node dist/main.js &
API_PID=$!

# Wait for API to be ready
echo "Waiting for API health check..."
for i in $(seq 1 60); do
  if curl -sf http://localhost:2785/api/health > /dev/null 2>&1; then
    echo "API is ready"
    break
  fi
  sleep 1
done

echo "Starting nginx on port 80..."
exec nginx -g "daemon off;"
