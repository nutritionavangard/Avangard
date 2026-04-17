@echo off
set /p msg="Mensaje del commit: "
git add .
git commit -m "%msg%"
git push origin main
echo --- SUBIDO A GITHUB - RENDER COMENZARA EL DEPLOY ---
pause