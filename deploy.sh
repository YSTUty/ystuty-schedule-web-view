#!/bin/bash

# Load `.env` file
#export $(grep -v '^#' .env | xargs)

X_BUILD_DIR=$(grep ^X_BUILD_DIR= .env | cut -d '=' -f2)
X_SERVER=$(grep ^X_SERVER= .env | cut -d '=' -f2)
X_DESTINATION=$(grep ^X_DESTINATION= .env | cut -d '=' -f2)

SERVER=${X_SERVER:-"./dist"}
DESTINATION=${X_DESTINATION:-"/var/www/html"}
# LOCAL_BUILD_DIR="./dist"
LOCAL_BUILD_DIR=${X_BUILD_DIR:-"./dist"}

# Check exists dir dist
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "Failed: folder ($LOCAL_BUILD_DIR) not found. Run: yarn build."
  exit 1
fi

echo "Deploy starting..."

# Copy files
echo "Copying files..."
# rsync -avz --delete "$LOCAL_BUILD_DIR/" "$SERVER:$DESTINATION" || { echo "Failed to copy files!"; exit 1; }
# rsync -avz -e 'ssh' "$LOCAL_BUILD_DIR/" "$SERVER:$DESTINATION" || { echo "Failed to copy files!"; exit 1; }
scp -r "$LOCAL_BUILD_DIR" "$SERVER:$DESTINATION" || { echo "Failed to copy files!"; exit 1; }

# # Set permissions
# echo "Setting permissions..."
# ssh $SERVER << EOF
#   echo "Going to $DESTINATION..."
#   cd $DESTINATION
#   echo "Setting permissions for files..."
#   chmod -R 755 .
# EOF

echo "Deploy completed! $(date '+%H:%M:%S')"
