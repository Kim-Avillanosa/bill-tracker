@echo off
echo Starting the app and API...


:: Navigate to the app directory and run it
start cmd /k "cd app && npm install && npm run dev"

:: Navigate to the api directory and run it
start cmd /k "cd api && npm install && npm run start:dev"

echo Both services have been started.
pause
