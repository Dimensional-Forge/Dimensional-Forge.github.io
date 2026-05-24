@echo off
cd /d "k:\My Drive\dimensionalforgewebsite"

git init
git remote remove origin 2>nul
git remote add origin https://github.com/Dimensional-Forge/Dimensional-Forge.github.io.git

git add .
git commit -m "Update site %date% %time%"
git branch -M main
git push -u origin main

echo.
echo Done! Site will be live at https://dimensional-forge.github.io in ~2 minutes.
pause
