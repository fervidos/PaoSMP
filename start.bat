@echo off
echo Starting PaoSMP via PM2...
pm2 start ecosystem.config.js
pm2 list
pause
