# Quick setup instructions - PowerShell version

Write-Host "===== Age of War - Rust WASM Setup =====" -ForegroundColor Green
Write-Host ""

# Check if Rust is installed
try {
    $rustVersion = rustc --version 2>$null
    Write-Host "✓ Rust đã cài đặt: $rustVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Rust không được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng tải Rust từ: https://rustup.rs/" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if Node is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✓ Node.js đã cài đặt: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js không được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng tải Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Đang cài đặt dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cài đặt npm dependencies thất bại!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✓ Dependencies đã cài xong" -ForegroundColor Green

Write-Host ""
Write-Host "Đang build Rust to WebAssembly..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build thất bại!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "✓ Build thành công!" -ForegroundColor Green
Write-Host ""
Write-Host "Khởi động local server..." -ForegroundColor Yellow
Write-Host "Mở trình duyệt tại: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Nhấn Ctrl+C để dừng server" -ForegroundColor Yellow
Write-Host ""

npx http-server

pause
