#!/bin/bash
cd "$(dirname "$0")" || exit 1
if ! command -v npm >/dev/null 2>&1; then
    echo "Node.js not found. Install it first: brew install node   (or https://nodejs.org)"
    read -r -p "Press Enter to close..."
    exit 1
fi
npm install
read -r -p "Done. Press Enter to close..."
