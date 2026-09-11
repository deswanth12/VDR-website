#!/bin/sh
set -e

echo "=== Vijaya Durga Refrigeration Production Container ==="
echo "Node Environment: $NODE_ENV"
echo "Data Directory:   ${DATA_DIR:-/app/data}"
echo "Upload Directory: ${UPLOADS_DIR:-/app/public/uploads}"

# Run schema and directory initialization
node scripts/docker-init.mjs

echo "=== Starting Next.js Standalone Production Server ==="
exec "$@"
