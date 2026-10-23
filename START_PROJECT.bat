@echo off
title MedVault Healthcare SaaS
color 0b

echo ========================================================
echo           MedVault Smart Healthcare SaaS Platform
echo ========================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is NOT installed on this computer!
    echo Please install Node.js ^(v18 or higher^) from:
    echo https://nodejs.org/
    echo.
    echo After installing Node.js, run this file again.
    pause
    exit /b 1
)

:: 2. Check and install dependencies if needed
if not exist "node_modules\" (
    echo [INFO] First-time setup detected: Installing packages...
    echo (Please wait 1-2 minutes while packages install)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        color 0c
        echo.
        echo [ERROR] 'npm install' failed. Please check your internet connection.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully!
    echo.
)

:: 3. Ensure .env exists
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [INFO] Created .env configuration file.
    )
)

:: 4. Start browser and development server
echo ========================================================
echo [SUCCESS] Starting MedVault Development Server...
echo Opening in your browser at: http://localhost:5173
echo (To stop the server, press Ctrl + C in this window)
echo ========================================================
echo.

start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"

call npm run dev

pause
