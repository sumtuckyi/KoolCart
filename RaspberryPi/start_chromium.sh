#! bin/bash

sleep 10

xrandr --output HDMI-1 --rotate right

sudo -ua101 DISPLAY=:0.0 chromium-browser -kiosk --app={YOUR_KIOSK_SERVICE_URL} --start-fullscreen --no-sandbox --user-data-dir
