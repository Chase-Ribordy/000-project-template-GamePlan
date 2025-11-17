# PowerShell script to properly restart Claude Desktop for MCP server changes

Write-Host "Stopping all Claude Desktop processes..." -ForegroundColor Yellow

# Kill all Claude processes
Get-Process -Name "claude" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Waiting 3 seconds for cleanup..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Claude Desktop has been stopped." -ForegroundColor Green
Write-Host ""
Write-Host "You can now start Claude Desktop manually." -ForegroundColor Cyan
Write-Host "After starting, check Settings > Developer > Local MCP Servers" -ForegroundColor Cyan
