#!/bin/sh
# Renders thumbs.html#1..5 to option-1.png..option-5.png with headless Chrome (needs internet for the Google Fonts).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
DIR="$(pwd -W 2>/dev/null || pwd)"
for n in 1 2 3 4 5; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,800 --virtual-time-budget=10000 --allow-file-access-from-files \
    --screenshot="$DIR/option-$n.png" "file:///$DIR/thumbs.html#$n" 2>/dev/null
done
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,800 --virtual-time-budget=10000 --screenshot="$DIR/growth.png" "file:///$DIR/growth.html" 2>/dev/null
ls -la option-*.png growth.png
