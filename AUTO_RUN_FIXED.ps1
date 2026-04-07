# Auto Install & Build Script for Age of War

Write-Host "=====================================" -ForegroundColor Green
Write-Host "Age of War - Auto Setup & Build" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js already installed
$nodeCheck = node --version 2>$null
if ($nodeCheck) {
    Write-Host "[OK] Node.js already installed: $nodeCheck" -ForegroundColor Green
} else {
    Write-Host "[INFO] Node.js not found. Downloading..." -ForegroundColor Yellow
    
    # Download Node.js LTS
    $url = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $installer = "$env:TEMP\nodejs-installer.msi"
    
    Write-Host "Downloading from: $url" -ForegroundColor Cyan
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $installer)
        Write-Host "[OK] Downloaded to: $installer" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] Download failed: $_" -ForegroundColor Red
        exit 1
    }
    
    # Install Node.js
    Write-Host "[INFO] Installing Node.js (this may take 2-3 minutes)..." -ForegroundColor Yellow
    
    try {
        $process = Start-Process msiexec.exe -ArgumentList "/i", $installer, "/quiet" -Wait -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Host "[OK] Node.js installed successfully" -ForegroundColor Green
            
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        } else {
            Write-Host "[ERROR] Installation failed with code: $($process.ExitCode)" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "[ERROR] Installation error: $_" -ForegroundColor Red
        exit 1
    }
}

# Verify Node.js and npm
Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($nodeVersion -and $npmVersion) {
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "[OK] npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js verification failed" -ForegroundColor Red
    exit 1
}

# Navigate to project
$projectPath = "d:\Học tập\Age Of War"
Write-Host ""
Write-Host "Going to project: $projectPath" -ForegroundColor Cyan
cd $projectPath

# Install npm dependencies
Write-Host ""
Write-Host "[INFO] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] npm dependencies installed" -ForegroundColor Green

# Build WASM
Write-Host ""
Write-Host "[INFO] Building Rust to WebAssembly (this takes 1-2 minutes)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] WebAssembly built successfully" -ForegroundColor Green

# Start server
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "[OK] Build complete! Starting server..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Game will open at: http://localhost:8000/index_rust.html" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host ""

# Start http-server
npx http-server
