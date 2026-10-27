#!/bin/bash
# Builds ACAS.app (+ .dmg/.zip) into ./dist for the current Mac's CPU.
cd "$(dirname "$0")" || exit 1
ARCH=$(uname -m)
[ "$ARCH" = "x86_64" ] && ARCH=x64
npm run "build:mac-$ARCH"
echo
echo "Done: see the dist/ folder. Copy dist/mac*/ACAS.app to /Applications."
read -r -p "Press Enter to close..."
