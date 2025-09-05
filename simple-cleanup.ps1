Write-Host "Cleaning up backup files..." -ForegroundColor Cyan

$productPath = "C:\NTWWeb\app\store\product\[id]"

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
        Write-Host "Removed: $file" -ForegroundColor Green
    }
}

Write-Host "Cleanup complete!" -ForegroundColor Green
