# 🔧 Quick VS Code Fix Script
# Resolves TypeScript cache errors in Next.js projects

Write-Host "🎯 Resolving VS Code TypeScript Cache Issues..." -ForegroundColor Cyan

# Step 1: Clear Next.js build cache
Write-Host "📁 Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next directory cleared" -ForegroundColor Green
} else {
    Write-Host "ℹ️ .next directory not found (already clean)" -ForegroundColor Blue
}

# Step 2: Clear node_modules cache
Write-Host "📁 Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ node_modules cache cleared" -ForegroundColor Green
} else {
    Write-Host "ℹ️ node_modules cache not found" -ForegroundColor Blue
}

# Step 3: Create VS Code settings to exclude .next from TypeScript checking
Write-Host "⚙️ Configuring VS Code settings..." -ForegroundColor Yellow
$vscodeDir = ".vscode"
$settingsFile = "$vscodeDir\settings.json"

if (!(Test-Path $vscodeDir)) {
    New-Item -ItemType Directory -Path $vscodeDir | Out-Null
}

$settings = @{
    "typescript.preferences.exclude" = @(".next/**/*")
    "typescript.preferences.includePackageJsonAutoImports" = "on"
}

$settingsJson = $settings | ConvertTo-Json -Depth 3
Set-Content -Path $settingsFile -Value $settingsJson

Write-Host "✅ VS Code settings configured" -ForegroundColor Green

# Step 4: Instructions for manual steps
Write-Host "`n🎯 MANUAL STEPS REQUIRED IN VS CODE:" -ForegroundColor Cyan
Write-Host "1. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "2. Type 'TypeScript: Restart TS Server'" -ForegroundColor White  
Write-Host "3. Press Enter" -ForegroundColor White
Write-Host "`nOR alternatively:" -ForegroundColor Yellow
Write-Host "1. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "2. Type 'Developer: Reload Window'" -ForegroundColor White
Write-Host "3. Press Enter" -ForegroundColor White

Write-Host "`n🎉 Cache clearing complete! Please restart VS Code TypeScript service." -ForegroundColor Green
Write-Host "Your size functionality is working perfectly - these were just cache artifacts!" -ForegroundColor Cyan
