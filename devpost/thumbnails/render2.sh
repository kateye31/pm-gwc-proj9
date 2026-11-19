#!/bin/sh
# Renders thumbs2.html#6..10 to option-6.png..option-10.png with headless Chrome (needs internet for the Google Fonts).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
DIR="$(pwd -W 2>/dev/null || pwd)"
for n in 6 7 8 9 10; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,800 --virtual-time-budget=10000 --allow-file-access-from-files \
    --screenshot="$DIR/option-$n.png" "file:///$DIR/thumbs2.html#$n" 2>/dev/null
done
ls -la option-*.png
