@echo off
echo ========================================================
echo   BANK ACCOUNT MANAGEMENT SYSTEM - Windows Run Script
echo ========================================================
echo.

if not exist bin mkdir bin

echo Compiling Java source files...
javac -d bin -cp ".;lib/mysql-connector-j-8.3.0.jar" src/model/*.java src/dao/*.java src/util/*.java src/ui/*.java src/Main.java

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Compilation failed!
    echo Please make sure Java JDK 11+ is installed and 'javac' is in your PATH.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Compilation successful! Launching Application...
java -cp "bin;lib/mysql-connector-j-8.3.0.jar;." Main
pause
