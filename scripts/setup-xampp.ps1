Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = Split-Path -Parent $PSScriptRoot
$frontendPath = Join-Path $rootPath "frontend"
$backendPath = Join-Path $rootPath "backend"
$phpExe = "C:\xampp\php\php.exe"
$mysqlExe = "C:\xampp\mysql\bin\mysql.exe"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"

if (-not (Test-Path $phpExe)) {
    Write-Error "XAMPP PHP not found at $phpExe"
    exit 1
}

if (-not (Test-Path $mysqlExe)) {
    Write-Error "XAMPP MySQL client not found at $mysqlExe"
    exit 1
}

if (-not (Test-Path $npmCmd)) {
    Write-Error "npm.cmd not found at $npmCmd"
    exit 1
}

Write-Output "Installing frontend dependencies..."
Set-Location $frontendPath
& $npmCmd install

Write-Output "Installing backend npm dependencies..."
Set-Location $backendPath
& $npmCmd install

$envPath = Join-Path $backendPath ".env"
$envExamplePath = Join-Path $backendPath ".env.example"
if (-not (Test-Path $envPath)) {
    Copy-Item $envExamplePath $envPath -Force
}

Write-Output "Generating Laravel app key..."
& $phpExe artisan key:generate

Write-Output "Creating MySQL database if missing..."
& $mysqlExe -u root -e "CREATE DATABASE IF NOT EXISTS laravel_react_db;"

Write-Output "Running migrations..."
& $phpExe artisan migrate --force

Write-Output ""
Write-Output "Setup completed using XAMPP binaries."
Write-Output "Start backend:  Set-Location C:\xampp\htdocs\Web\backend; & C:\xampp\php\php.exe artisan serve --host=127.0.0.1 --port=8000"
Write-Output "Start frontend: Set-Location C:\xampp\htdocs\Web\frontend; npm run dev"
