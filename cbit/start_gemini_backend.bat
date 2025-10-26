@echo off
echo ========================================
echo Starting Gemini Caption Generator Backend
echo ========================================
echo.

cd backend

REM Check if venv exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Install Gemini dependencies
echo Installing dependencies...
pip install -r requirements_gemini.txt
echo.

REM Start Gemini backend
echo ========================================
echo Starting Gemini Backend Server on Port 5001
echo ========================================
echo.
python gemini_app.py

pause
