# Full-Stack Web Workspace

This workspace is configured for:

- Frontend: React + Vite
- Backend: Laravel 12 (API-ready)
- Database: MySQL

## XAMPP Setup (No cd .. Chains)

Use these absolute paths in PowerShell:

```powershell
Set-Location C:\xampp\htdocs\Web
./scripts/setup-xampp.ps1
```

What the script does:

- Installs frontend npm packages
- Installs backend npm packages
- Creates backend/.env if missing
- Generates Laravel app key via C:\xampp\php\php.exe
- Creates MySQL database laravel_react_db via C:\xampp\mysql\bin\mysql.exe
- Runs Laravel migrations

## Manual XAMPP Commands (Absolute Paths)

Frontend dependencies:

```powershell
Set-Location C:\xampp\htdocs\Web\frontend
npm install
```

Backend dependencies:

```powershell
Set-Location C:\xampp\htdocs\Web\backend
npm install
```

Laravel key:

```powershell
Set-Location C:\xampp\htdocs\Web\backend
if (!(Test-Path .env)) { Copy-Item .env.example .env -Force }
& "C:\xampp\php\php.exe" artisan key:generate
```

Create DB + migrate:

```powershell
Set-Location C:\xampp\htdocs\Web\backend
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS laravel_react_db;"
& "C:\xampp\php\php.exe" artisan migrate --force
```

## Run Development Servers

Backend:

```powershell
Set-Location C:\xampp\htdocs\Web\backend
& "C:\xampp\php\php.exe" artisan serve --host=127.0.0.1 --port=8000
```

Frontend:

```powershell
Set-Location C:\xampp\htdocs\Web\frontend
npm run dev
```

If MySQL is not running, start it from XAMPP Control Panel, then run the DB commands above.
