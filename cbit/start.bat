@echo off
echo ==========================================
echo  Starting Caption Generator Application
echo ==========================================
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && echo Backend server starting on http://localhost:5000 && python app.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "echo Frontend server starting on http://localhost:5173 && npm run dev"

echo.
echo Both servers are starting...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul