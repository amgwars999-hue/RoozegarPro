@echo off
chcp 65001 >nul
echo ==========================================
echo  Roozegar Pro - Clean Install
echo ==========================================
echo.

echo [1/5] Checking path...
set "PROJECT_PATH=%~dp0"
echo Project path: %PROJECT_PATH%

echo %PROJECT_PATH% | findstr /C:"پ" /C:"چ" /C:"ج" /C:"ح" /C:"خ" /C:"ه" /C:"ع" /C:"غ" /C:"ف" /C:"ق" /C:"ث" /C:"ص" /C:"ض" /C:"ط" /C:"ظ" /C:"ش" /C:"س" /C:"ی" /C:"ب" /C:"ل" /C:"ا" /C:"ت" /C:"ن" /C:"م" /C:"ک" /C:"گ" /C:"و" /C:"د" /C:"ذ" /C:"ر" /C:"ز" /C:"ژ" >nul
if %errorlevel% == 0 (
    echo.
    echo [WARNING] Path contains Persian characters!
    echo This may cause issues. Consider moving to: E:\Projects\RoozegarPro
    echo.
    choice /C YN /M "Continue anyway"
    if %errorlevel% == 2 exit /b 1
)

echo.
echo [2/5] Cleaning old files...
if exist node_modules (
    rmdir /s /q node_modules
    echo    - node_modules deleted
)
if exist package-lock.json (
    del package-lock.json
    echo    - package-lock.json deleted
)
npm cache clean --force >nul 2>&1
echo    - npm cache cleaned

echo.
echo [3/5] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install failed! Trying with --legacy-peer-deps...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Still failed. Please check your internet connection.
        pause
        exit /b 1
    )
)

echo.
echo [4/5] Verifying installation...
if exist node_modules\expo\package.json (
    echo    - expo: OK
) else (
    echo    - expo: MISSING!
)
if exist node_modules\react-native\package.json (
    echo    - react-native: OK
) else (
    echo    - react-native: MISSING!
)

echo.
echo [5/5] Starting Expo...
echo ==========================================
echo Press 'i' for iOS, 'a' for Android, or scan QR with Expo Go
echo ==========================================
echo.

npx expo start --clear

pause
