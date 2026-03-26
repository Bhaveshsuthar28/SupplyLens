#!/bin/bash
# SupplyLens Dataset Downloader
# This script downloads the sample datasets from GitHub Releases

set -e

echo "========================================"
echo "  SupplyLens Dataset Downloader"
echo "========================================"
echo ""

# TODO: Replace with your actual GitHub username and release version
GITHUB_USERNAME="YOUR_USERNAME"
RELEASE_VERSION="v1.0.0"

BASE_URL="https://github.com/$GITHUB_USERNAME/SupplyLens/releases/download/$RELEASE_VERSION"
FILES=(
    "supplier_orders_week1_new.xlsx"
    "supplier_orders_week2_new.xlsx"
    "supplier_orders_week3_new.xlsx"
    "supplier_orders_week4_new.xlsx"
)

# Create Dataset directory if it doesn't exist
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DATASET_DIR="$SCRIPT_DIR/Dataset"

if [ ! -d "$DATASET_DIR" ]; then
    echo "Creating Dataset directory..."
    mkdir -p "$DATASET_DIR"
fi

cd "$DATASET_DIR"

# Download each file
SUCCESS_COUNT=0
for file in "${FILES[@]}"; do
    echo "Downloading $file..."
    if curl -LO "$BASE_URL/$file"; then
        echo "  ✓ Downloaded successfully"
        ((SUCCESS_COUNT++))
    else
        echo "  ✗ Failed to download"
        echo "  Make sure you've:"
        echo "    1. Updated GITHUB_USERNAME in this script"
        echo "    2. Created a GitHub Release with version $RELEASE_VERSION"
        echo "    3. Uploaded the dataset files to the release"
    fi
done

echo ""
echo "========================================"
echo "  Download Complete!"
echo "  Successfully downloaded: $SUCCESS_COUNT/${#FILES[@]} files"
echo "========================================"
