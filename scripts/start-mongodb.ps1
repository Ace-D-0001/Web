Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = Split-Path -Parent $PSScriptRoot

$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
    Write-Error "Docker is not installed or not in PATH. Install Docker Desktop first, then run this script again."
    exit 1
}

Set-Location $rootPath
Write-Output "Starting MySQL services with Docker Compose ..."
docker compose up -d mysql phpmyadmin
Write-Output "MySQL started on localhost:3306"
Write-Output "phpMyAdmin available on http://localhost:8081"
