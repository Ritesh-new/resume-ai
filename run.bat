@echo off
echo ==========================================
echo Starting Resume Builder Backend and Frontend
echo ==========================================
cd /d "%~dp0backend"
start "Resume Builder - Backend" cmd /k "npm run dev"

cd /d "%~dp0frontend"
start "Resume Builder - Frontend" cmd /k "npm run dev"

echo Waiting for servers to initialize...
timeout /t 3 >nul
start http://localhost:5173
