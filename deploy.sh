#!/usr/bin/env bash

# Load `.env.local` file
get_env_var() {
  local var_name=$1

  local value=$(grep -E "^${var_name}=" .env.production 2>/dev/null | cut -d '=' -f2-)

  if [ -z "$value" ]; then
    value=$(grep -E "^${var_name}=" .env.local 2>/dev/null | cut -d '=' -f2-)
  fi

  if [ -z "$value" ]; then
    value=$(grep -E "^${var_name}=" .env 2>/dev/null | cut -d '=' -f2-)
  fi

  echo "$value"
}

X_BUILD_DIR=$(get_env_var X_BUILD_DIR)
X_SERVER=$(get_env_var X_SERVER)
X_DESTINATION=$(get_env_var X_DESTINATION)

SERVER=${X_SERVER:-"localhost"}
DESTINATION=${X_DESTINATION:-"/var/www/html"}
LOCAL_BUILD_DIR=${X_BUILD_DIR:-"./build"}

DESTINATION=${DESTINATION%/}

# Check exists dir dist
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "Failed: folder ($LOCAL_BUILD_DIR) not found. Run: npm run build."
  exit 1
fi

echo "Deploying to $SERVER:$DESTINATION ..."

# Copy files
echo "Copying files..."
scp -r "$LOCAL_BUILD_DIR"/. "$SERVER:$DESTINATION" || { echo "Failed to copy files!"; exit 1; }

# Upload version.json
VERSION=$(node -p "require('./package.json').version")
VERSION_FILE="$(mktemp)-version.json"

echo "Update public version to [$VERSION]"
printf '{"version":"%s"}\n' "$VERSION" > "$VERSION_FILE"
scp "$VERSION_FILE" "$SERVER:$DESTINATION/version.json" || { echo "Failed to copy version.json!"; exit 1; }
rm -f "$VERSION_FILE"

echo "Deploy completed! $(date '+%H:%M:%S')"
