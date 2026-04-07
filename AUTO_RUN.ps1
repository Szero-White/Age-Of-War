# Auto Install & Build Script for Age of War

Write-Host "=====================================" -ForegroundColor Green
Write-Host "Age of War - Auto Setup & Build" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js already installed
$nodeCheck = node --version 2>$null
if ($nodeCheck) {
    Write-Host "✓ Node.js already installed: $nodeCheck" -ForegroundColor Green
} else {
    Write-Host "⏳ Node.js not found. Downloading..." -ForegroundColor Yellow
    
    # Download Node.js LTS (v20.10.0)
    $url = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $installer = "$env:TEMP\nodejs-installer.msi"
    
    Write-Host "Downloading from: $url" -ForegroundColor Cyan
    
    try {
        # Use .NET to download (more reliable than curl in PowerShell)
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $installer)
        Write-Host "✓ Downloaded to: $installer" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Download failed: $_" -ForegroundColor Red
        Write-Host "Please download manually from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
    
    # Install Node.js
    Write-Host "⏳ Installing Node.js (this may take 2-3 minutes)..." -ForegroundColor Yellow
    
    try {
        $process = Start-Process msiexec.exe -ArgumentList "/i", $installer, "/quiet" -Wait -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Host "✓ Node.js installed successfully" -ForegroundColor Green
            
            # Refresh PATH for current session
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            Start-Sleep -Seconds 2
        } else {
            Write-Host "✗ Installation failed with code: $($process.ExitCode)" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "✗ Installation error: $_" -ForegroundColor Red
        exit 1
    }
}

# Verify Node.js and npm
Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($nodeVersion -and $npmVersion) {
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js verification failed" -ForegroundColor Red
    Write-Host "Please restart PowerShell and try again" -ForegroundColor Yellow
    exit 1
}

# Navigate to project
$projectPath = "d:\Học tập\Age Of War"
Write-Host ""
Write-Host "Going to project: $projectPath" -ForegroundColor Cyan
cd $projectPath

# Install npm dependencies
Write-Host ""
Write-Host "⏳ Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm dependencies installed" -ForegroundColor Green

# Build WASM
Write-Host ""
Write-Host "⏳ Building Rust to WebAssembly (this takes 1-2 minutes)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ WebAssembly built successfully" -ForegroundColor Green

# Check if pkg folder was created
if (Test-Path "rust_src/pkg/age_of_war.js") {
    Write-Host "✓ WASM module created at: rust_src/pkg/" -ForegroundColor Green
} else {
    Write-Host "✗ WASM module not found" -ForegroundColor Red
    exit 1
}

# Start server
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✓ Build complete! Starting server..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Game will open at: http://localhost:8000/index_rust.html" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host ""

# Start http-server
npx http-server
