# Backup File Cleanup Script
# Handles bracket paths properly

Write-Host "🧹 Cleaning up backup files..." -ForegroundColor Cyan

# Get the product directory with brackets
$productPath = "C:\NTWWeb\app\store\product\[id]"

# Remove specific problematic files
$filesToRemove = @(
    "page-backup-clean.tsx",
    "page-backup-final.tsx", 
    "page-backup-fixed.tsx",
    "page-backup.tsx",
    "page-CLEAN.tsx",
    "page-ENHANCED-COMPLETE.tsx",
    "page-enhanced-temp.tsx",
    "page-FIXED-FINAL.tsx",
    "page-FIXED.tsx",
    "page-minimal.tsx",
    "page-new.tsx", 
    "page-premium.tsx",
    "page-with-validation.tsx",
    "page.ENHANCED-PROTECTED.tsx"
)

foreach ($file in $filesToRemove) {
    $fullPath = Join-Path $productPath $file
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "✅ Removed: $file" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Not found: $file" -ForegroundColor Yellow
    }
}

# Verify only page.tsx remains
Write-Host "`n📁 Remaining TypeScript files:" -ForegroundColor Cyan
Get-ChildItem $productPath -Filter "*.tsx" | Select-Object Name | ForEach-Object { 
    Write-Host "  - $($_.Name)" -ForegroundColor White
}

Write-Host "`n🎉 Cleanup complete!" -ForegroundColor Green
