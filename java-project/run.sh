#!/bin/bash
# ========================================================
# BANK ACCOUNT MANAGEMENT SYSTEM - Linux/macOS Run Script
# ========================================================

echo "========================================================"
echo "  BANK ACCOUNT MANAGEMENT SYSTEM - Mac / Linux Launcher"
echo "========================================================"
echo ""

mkdir -p bin

echo "Compiling Java source files..."
javac -d bin -cp ".:lib/*" src/model/*.java src/dao/*.java src/util/*.java src/ui/*.java src/Main.java

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Compilation failed! Ensure JDK 11+ is installed."
    exit 1
fi

echo ""
echo "Compilation successful! Launching Swing Application..."
java -cp "bin:lib/*:." Main
