Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $rootPath "backend"

$composer = Get-Command composer -ErrorAction SilentlyContinue
if (-not $composer) {
    Write-Error "Composer is not installed or not in PATH. Install PHP + Composer first, then run this script again."
    exit 1
}

$artisanPath = Join-Path $backendPath "artisan"
if (Test-Path $artisanPath) {
    Write-Output "Laravel already exists in $backendPath"
    exit 0
}

$existingEntries = @(Get-ChildItem -Path $backendPath -Force)
if ($existingEntries.Count -gt 0) {
    Write-Error "Backend folder is not empty and does not contain a Laravel app. Empty it or choose another path."
    exit 1
}

Write-Output "Creating Laravel project in $backendPath ..."
composer create-project laravel/laravel $backendPath
Write-Output "Laravel project created successfully."
