@echo off
echo ==========================================
echo  Fixing Git Remote URL
echo ==========================================
echo.

cd "E:\projects\New folder\RoozegarPro"

echo [1/3] Removing old remote...
git remote remove origin

echo [2/3] Adding correct remote with YOUR username...
git remote add origin https://github.com/amgwars999-hue/RoozegarPro.git

echo [3/3] Checking remote...
git remote -v

echo.
echo ==========================================
echo  Now run: git push -u origin main
echo ==========================================
pause
