@echo off
setlocal enableextensions
set SCRIPT_DIR=%~dp0
echo Starting MokBeats (Windows)...
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start.ps1"
endlocal
