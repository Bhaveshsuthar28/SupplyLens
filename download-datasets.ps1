# SupplyLens Dataset Downloader
# This script downloads the sample datasets from GitHub Releases

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SupplyLens Dataset Downloader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# TODO: Replace with your actual GitHub username and release version
$GITHUB_USERNAME = "YOUR_USERNAME"
$RELEASE_VERSION = "v1.0.0"

$base_url = "https://github.com/$GITHUB_USERNAME/SupplyLens/releases/download/$RELEASE_VERSION"
$files = @(
    "supplier_orders_week1_new.xlsx",
    "supplier_orders_week2_new.xlsx",
    "supplier_orders_week3_new.xlsx",
    "supplier_orders_week4_new.xlsx"
)

# Create Dataset directory if it doesn't exist
$datasetDir = Join-Path $PSScriptRoot "Dataset"
if (-not (Test-Path $datasetDir)) {
    Write-Host "Creating Dataset directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $datasetDir | Out-Null
}

# Download each file
$successCount = 0
foreach ($file in $files) {
    $filePath = Join-Path $datasetDir $file
    
    Write-Host "Downloading $file..." -ForegroundColor Green
    try {
        Invoke-WebRequest -Uri "$base_url/$file" -OutFile $filePath -ErrorAction Stop
        Write-Host "  ✓ Downloaded successfully" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "  ✗ Failed to download: $_" -ForegroundColor Red
        Write-Host "  Make sure you've:" -ForegroundColor Yellow
        Write-Host "    1. Updated GITHUB_USERNAME in this script" -ForegroundColor Yellow
        Write-Host "    2. Created a GitHub Release with version $RELEASE_VERSION" -ForegroundColor Yellow
        Write-Host "    3. Uploaded the dataset files to the release" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Download Complete!" -ForegroundColor Cyan
Write-Host "  Successfully downloaded: $successCount/$($files.Count) files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
