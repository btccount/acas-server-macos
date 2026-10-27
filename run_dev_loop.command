#!/bin/bash
cd "$(dirname "$0")" || exit 1
while true; do
    npm start
    echo "Dev server stopped. Restarting... (Ctrl+C to quit)"
    sleep 1
done
