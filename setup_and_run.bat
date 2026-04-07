# Quick setup instructions - Windows batch file

@echo off
echo ===== Age of War - Rust WASM Setup =====
echo.

REM Check if Rust is installed
rustc --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Rust không được cài đặt!
    echo Vui lòng tải Rust từ: https://rustup.rs/
    pause
    exit /b 1
)

echo ✓ Rust đã cài đặt
rustc --version

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js không được cài đặt!
    echo Vui lòng tải Node.js từ: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js đã cài đặt
node --version

echo.
echo Đang cài đặt dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Cài đặt npm dependencies thất bại!
    pause
    exit /b 1
)

echo ✓ Dependencies đã cài xong

echo.
echo Đang build Rust to WebAssembly...
call npm run build

if errorlevel 1 (
    echo ❌ Build thất bại!
    pause
    exit /b 1
)

echo.
echo ✓ Build thành công!
echo.
echo Khởi động local server...
echo Mở trình duyệt tại: http://localhost:8000
echo Nhấn Ctrl+C để dừng server
echo.

npx http-server

pause
