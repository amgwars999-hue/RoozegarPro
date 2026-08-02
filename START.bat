@echo off
chcp 65001 >nul
echo ==========================================
echo  Roozegar Pro - Launcher
echo ==========================================
echo.

REM Check if path contains non-ASCII characters
set "PROJECT_PATH=%~dp0"
echo Current path: %PROJECT_PATH%
echo.

REM Check for Persian/Arabic characters in path
echo %PROJECT_PATH% | findstr /C:"پ" /C:"چ" /C:"ج" /C:"ح" /C:"خ" /C:"ه" /C:"ع" /C:"غ" /C:"ف" /C:"ق" /C:"ث" /C:"ص" /C:"ض" /C:"ط" /C:"ظ" /C:"ش" /C:"س" /C:"ی" /C:"ب" /C:"ل" /C:"ا" /C:"ت" /C:"ن" /C:"م" /C:"ک" /C:"گ" /C:"و" /C:"د" /C:"ذ" /C:"ر" /C:"ز" /C:"ژ" /C:"ط" /C:"ظ" >nul
if %errorlevel% == 0 (
    echo [ERROR] Project path contains Persian/Arabic characters!
    echo.
    echo Please move the project to an English path like:
    echo    E:\Projects\RoozegarPro
    echo    C:\Dev\RoozegarPro
    echo    D:\Code\RoozegarPro
    echo.
    echo Then run this file again from the new location.
    echo.
    pause
    exit /b 1
)

echo [OK] Path check passed.
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] node_modules not found. Running npm install...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        echo Try: npm install --legacy-peer-deps
        pause
        exit /b 1
    )
)

echo [OK] Dependencies installed.
echo.
echo Starting Expo...
echo ==========================================
echo.

npx expo start

pause
