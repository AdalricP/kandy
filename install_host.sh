#!/bin/bash

# ID of the extension (user must input this)
EXTENSION_ID=$1

if [ -z "$EXTENSION_ID" ]; then
    echo "Usage: ./install_host.sh <EXTENSION_ID>"
    echo "Error: Extension ID is required. Copy it from chrome://extensions"
    exit 1
fi

HOST_NAME="com.antigravity.arxiv_downloader"
HOST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HOST_PATH="$SCRIPT_DIR/src/native_host.py"

# Make script executable
chmod +x "$HOST_PATH"

mkdir -p "$HOST_DIR"

# Create Manifest
cat > "$HOST_DIR/$HOST_NAME.json" <<EOF
{
  "name": "$HOST_NAME",
  "description": "ArXiv Downloader Native Host",
  "path": "$HOST_PATH",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$EXTENSION_ID/"
  ]
}
EOF

echo "Native Host registered successfully!"
echo "Manifest: $HOST_DIR/$HOST_NAME.json"
echo "Host Script: $HOST_PATH"
echo "Allowing Extension ID: $EXTENSION_ID"
