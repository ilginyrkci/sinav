@echo off
title Ortaokul Sinav Hazirlik Asistani
echo ===================================================
echo     ORTAOKUL VE LGS SINAV HAZIRLIK ASISTANI
echo ===================================================
echo.
echo [1/2] Python FastAPI Backend baslatiliyor (Port: 8000)...
start "Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo [2/2] Vite React Frontend baslatiliyor (Port: 5173)...
start "Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo   Sistem baslatildi!
echo   Frontend: http://localhost:5173
echo   Backend Swagger API: http://localhost:8000/docs
echo ===================================================
timeout /t 3 >nul
start http://localhost:5173
