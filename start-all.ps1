# AgriDirect Microservices Startup Script for Windows PowerShell
param (
    [switch]$Docker = $true,
    [switch]$Down = $false,
    [switch]$Status = $false
)

$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

if ($Down) {
    Write-Host "Stopping AgriDirect Docker containers..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    docker compose down
    Write-Host "All containers stopped." -ForegroundColor Green
    exit 0
}

if ($Status) {
    Write-Host "Checking AgriDirect Docker container status..." -ForegroundColor Cyan
    docker ps --filter "name=agridirect"
    exit 0
}

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "   AgriDirect Microservices Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Starting services via Docker Compose..." -ForegroundColor Green
docker compose up -d

Write-Host ""
Write-Host "Waiting 5 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Services URL Map:" -ForegroundColor Cyan
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
Write-Host "Check status anytime with: .\start-all.ps1 -Status" -ForegroundColor Yellow
Write-Host "Stop all services with:    .\start-all.ps1 -Down" -ForegroundColor Yellow
