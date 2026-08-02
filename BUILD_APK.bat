@echo off
chcp 65001 >nul
echo ==========================================
echo  Roozegar Pro - Local APK Builder
echo ==========================================
echo.

echo [1/6] Checking node_modules...
if not exist "node_modules\expo\package.json" (
    echo [INFO] node_modules not found or incomplete. Running npm install...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
) else (
    echo [OK] node_modules found.
)

echo.
echo [2/6] Running Expo prebuild for Android...
call npx expo prebuild -p android --clean
if %errorlevel% neq 0 (
    echo [ERROR] prebuild failed!
    pause
    exit /b 1
)

echo.
echo [3/6] Checking Android folder...
if not exist "android\gradlew.bat" (
    echo [ERROR] Android project not generated properly!
    pause
    exit /b 1
)

echo.
echo [4/6] Building APK (this may take 5-10 minutes)...
cd android

REM Make gradlew executable (not needed on Windows but just in case)
if exist "gradlew" (
    echo [OK] gradlew found.
)

REM Build the APK
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Trying with assembleDebug...
    call gradlew.bat assembleDebug
    if %errorlevel% neq 0 (
        echo [ERROR] Debug build also failed!
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Debug APK built successfully!
    set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
) else (
    echo [OK] Release APK built successfully!
    set APK_PATH=app\build\outputs\apk\release\app-release-unsigned.apk
)

cd ..

echo.
echo ==========================================
echo  BUILD COMPLETE!
echo ==========================================
echo.
echo Your APK is located at:
echo   android\%APK_PATH%
echo.
echo To install on your phone:
echo   1. Enable "Developer Options" and "USB Debugging"
echo   2. Connect phone via USB
echo   3. Run: adb install android\%APK_PATH%
echo.
echo Or copy the APK to your phone and install directly.
echo.
pause
