@echo off
echo Stopping PaoSMP...
pm2 stop pao-minecraft pao-pack-host
pm2 list
pause
