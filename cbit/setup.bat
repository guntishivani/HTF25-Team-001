@echo off
echo ==========================================
echo  Caption Generator Setup Script
echo ==========================================
echo.

echo Checking if Python is installed...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Checking if FFmpeg is installed...
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: FFmpeg is not installed or not in PATH
    echo Please install FFmpeg for video processing:
    echo - Download from: https://ffmpeg.org/download.html
    echo - Or use chocolatey: choco install ffmpeg
    echo - Or use winget: winget install FFmpeg
    echo.
)

echo ==========================================
echo  Setting up Backend...
echo ==========================================
cd backend

echo Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo ==========================================
echo  Setting up Frontend...
echo ==========================================
cd ..

echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo ==========================================
echo  Setup Complete!
echo ==========================================
echo.
echo To start the application:
echo.
echo 1. Start the backend server:
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 2. In another terminal, start the frontend:
echo    npm run dev
echo.
echo The frontend will be available at: http://localhost:5173
echo The backend API will be available at: http://localhost:5000
echo.
pause