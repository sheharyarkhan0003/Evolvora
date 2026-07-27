@echo off
title Evolvora Website - Local Preview
cd /d "%~dp0"
echo Starting the Evolvora website preview...
echo A browser tab will open automatically. Keep this window open.
echo.
node serve.js
echo.
echo Server stopped. If you saw an error above, make sure Node.js is installed (https://nodejs.org).
pause
