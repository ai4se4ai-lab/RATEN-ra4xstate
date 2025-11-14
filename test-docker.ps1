# PowerShell test script for Docker build and run

Write-Host "=== Building Docker Image ===" -ForegroundColor Cyan
docker build -t raten-xstate:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Running Container ===" -ForegroundColor Cyan
docker run --rm raten-xstate:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker run failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Testing RATEN Package Import ===" -ForegroundColor Cyan
docker run --rm raten-xstate:latest node -e "const raten = require('./lib/index.js'); const xstate = require('xstate'); console.log('✓ RATEN package:', Object.keys(raten).join(', ')); console.log('✓ xstate available:', typeof xstate.createMachine === 'function');"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Package test failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All tests passed!" -ForegroundColor Green

