# Dataset Setup Guide

## Overview
This project uses sample supplier order datasets for demonstration. The datasets are hosted on GitHub Releases for easy download.

## Quick Download

### Option 1: Direct Download Links (Recommended)
Once released, use these direct download links:

```
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week1_new.xlsx
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week2_new.xlsx
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week3_new.xlsx
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week4_new.xlsx
```

### Option 2: Manual Download
1. Go to the [Releases page](https://github.com/YOUR_USERNAME/SupplyLens/releases)
2. Download the latest release
3. Extract the dataset files to the `Dataset/` folder

## Dataset Structure

```
Dataset/
├── supplier_orders_week1_new.xlsx
├── supplier_orders_week2_new.xlsx
├── supplier_orders_week3_new.xlsx
└── supplier_orders_week4_new.xlsx
```

## How to Create the Release (For Maintainers)

### Step 1: Commit Your Code (Without Datasets)
```bash
# Make sure datasets are gitignored
echo "Dataset/*.xlsx" >> .gitignore
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Create a GitHub Release

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/YOUR_USERNAME/SupplyLens`

2. **Click on "Releases"** (right sidebar)

3. **Click "Create a new release"**

4. **Fill in the release details:**
   - **Tag version:** `v1.0.0` (or your preferred version)
   - **Release title:** `SupplyLens v1.0.0 - Sample Datasets`
   - **Description:**
     ```markdown
     # SupplyLens Sample Datasets
     
     This release includes sample supplier order datasets for testing the SupplyLens application.
     
     ## Included Files:
     - `supplier_orders_week1_new.xlsx` - Week 1 supplier orders
     - `supplier_orders_week2_new.xlsx` - Week 2 supplier orders
     - `supplier_orders_week3_new.xlsx` - Week 3 supplier orders
     - `supplier_orders_week4_new.xlsx` - Week 4 supplier orders
     
     ## Usage:
     1. Download all 4 files
     2. Place them in the `Dataset/` folder of your SupplyLens project
     3. Run the application
     
     For setup instructions, see the [README](https://github.com/YOUR_USERNAME/SupplyLens#readme).
     ```

5. **Attach the dataset files:**
   - Drag and drop all 4 Excel files into the "Attach binaries" section
   - OR click "Attach binaries by dropping them here or selecting them" and browse to select the files

6. **Click "Publish release"**

### Step 3: Update README with Download Instructions

Add this section to your main README.md:

```markdown
## Dataset Setup

The sample datasets are not included in the repository to keep it lightweight. Download them from the latest release:

**Quick Download:**
```bash
# Download datasets using curl (Linux/Mac)
cd Dataset/
curl -LO https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week1_new.xlsx
curl -LO https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week2_new.xlsx
curl -LO https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week3_new.xlsx
curl -LO https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week4_new.xlsx
```

**Or download manually:** [Go to Releases](https://github.com/YOUR_USERNAME/SupplyLens/releases)
```

## Automated Download Script

You can also provide a script for users to download datasets automatically.

**For Windows (PowerShell):**
```powershell
# download-datasets.ps1
$base_url = "https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0"
$files = @(
    "supplier_orders_week1_new.xlsx",
    "supplier_orders_week2_new.xlsx",
    "supplier_orders_week3_new.xlsx",
    "supplier_orders_week4_new.xlsx"
)

New-Item -ItemType Directory -Force -Path "Dataset"
Set-Location "Dataset"

foreach ($file in $files) {
    Write-Host "Downloading $file..."
    Invoke-WebRequest -Uri "$base_url/$file" -OutFile $file
}

Write-Host "All datasets downloaded successfully!"
```

**For Linux/Mac (Bash):**
```bash
#!/bin/bash
# download-datasets.sh

BASE_URL="https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0"
FILES=(
    "supplier_orders_week1_new.xlsx"
    "supplier_orders_week2_new.xlsx"
    "supplier_orders_week3_new.xlsx"
    "supplier_orders_week4_new.xlsx"
)

mkdir -p Dataset
cd Dataset

for file in "${FILES[@]}"; do
    echo "Downloading $file..."
    curl -LO "$BASE_URL/$file"
done

echo "All datasets downloaded successfully!"
```

## Notes

- Replace `YOUR_USERNAME` with your actual GitHub username
- Replace `v1.0.0` with your actual release version
- The dataset files are excluded from git via `.gitignore`
- Each release can host up to 2GB of assets
