[CmdletBinding()]
param (
    [switch]$Down,
    [switch]$Status,
    [switch]$Seed,
    [switch]$Logs
)

$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

if ($Down.IsPresent) {
    Write-Host "🛑 Stopping KisanSetu Docker containers..." -ForegroundColor Yellow
    docker compose down
    Write-Host "✅ All containers stopped." -ForegroundColor Green
    return
}

if ($Status.IsPresent) {
    Write-Host "🔍 Checking KisanSetu Docker container status..." -ForegroundColor Cyan
    docker compose ps
    return
}

if ($Logs.IsPresent) {
    Write-Host "📜 Showing KisanSetu logs..." -ForegroundColor Cyan
    docker compose logs -f
    return
}

if ($Seed.IsPresent) {
    Write-Host "🌱 Seeding database with demo farmers and products..." -ForegroundColor Green
    docker compose exec auth node seed.js
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    return
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   🌾 KisanSetu (AgriDirect) Ecosystem Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚙️ Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

Write-Host "🚀 Starting all services via Docker Compose..." -ForegroundColor Green
docker compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host ""
Write-Host "🌐 Services URL Map:" -ForegroundColor Cyan
Write-Host "  Frontend (Web App):  http://localhost:5173" -ForegroundColor Green
Write-Host "  API Gateway:         http://localhost:8000" -ForegroundColor White
Write-Host "  Auth Service:        http://localhost:5001" -ForegroundColor White
Write-Host "  User Service:        http://localhost:5002" -ForegroundColor White
Write-Host "  Product Service:     http://localhost:5003" -ForegroundColor White
Write-Host "  Order Service:       http://localhost:5004" -ForegroundColor White
Write-Host "  Communication:       http://localhost:5005" -ForegroundColor White
Write-Host "  Feedback Service:    http://localhost:5006" -ForegroundColor White
Write-Host "  Payment Service:     http://localhost:5007" -ForegroundColor White
Write-Host "  AI Service:          http://localhost:5008" -ForegroundColor White
Write-Host "  MongoDB:             mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "💡 Commands:" -ForegroundColor Yellow
Write-Host "  Seed Demo Data:  .\start-all.ps1 -Seed" -ForegroundColor White
Write-Host "  Check Status:    .\start-all.ps1 -Status" -ForegroundColor White
Write-Host "  View Live Logs:  .\start-all.ps1 -Logs" -ForegroundColor White
Write-Host "  Stop Services:   .\start-all.ps1 -Down" -ForegroundColor White
