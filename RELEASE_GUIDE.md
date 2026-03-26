# 🚀 Quick Reference: Publishing Datasets to GitHub Releases

## Step-by-Step Guide

### 1️⃣ First, Commit Your Code (WITHOUT the datasets)

The datasets are now excluded from Git via `.gitignore`, so they won't be committed.

```bash
git add .
git commit -m "Add dataset download scripts and documentation"
git push origin main
```

### 2️⃣ Create a GitHub Release

1. **Navigate to your GitHub repository**
   - Go to: `https://github.com/YOUR_USERNAME/SupplyLens`

2. **Click "Releases"** on the right sidebar
   - Or go directly to: `https://github.com/YOUR_USERNAME/SupplyLens/releases`

3. **Click "Draft a new release"** (green button)

4. **Fill in the release form:**

   **Choose a tag:**
   - Enter: `v1.0.0`
   - Click "Create new tag: v1.0.0 on publish"

   **Release title:**
   ```
   SupplyLens v1.0.0 - Sample Datasets
   ```

   **Description:**
   ```markdown
   # 📊 SupplyLens Sample Datasets
   
   This release includes sample supplier order datasets for testing and demonstration.
   
   ## 📦 Included Files:
   
   - `supplier_orders_week1_new.xlsx` - Week 1 supplier orders
   - `supplier_orders_week2_new.xlsx` - Week 2 supplier orders  
   - `supplier_orders_week3_new.xlsx` - Week 3 supplier orders
   - `supplier_orders_week4_new.xlsx` - Week 4 supplier orders
   
   ## 🔧 How to Use:
   
   ### Automated Download (Recommended):
   ```powershell
   # Windows
   .\download-datasets.ps1
   ```
   
   ```bash
   # Linux/Mac
   chmod +x download-datasets.sh
   ./download-datasets.sh
   ```
   
   ### Manual Download:
   1. Download all 4 Excel files below
   2. Place them in the `Dataset/` folder
   3. Run the application
   
   ## 📖 Documentation:
   - [Getting Started Guide](https://github.com/YOUR_USERNAME/SupplyLens#getting-started)
   - [Dataset Setup Details](https://github.com/YOUR_USERNAME/SupplyLens/blob/main/DATASET_SETUP.md)
   ```

5. **Upload the dataset files:**
   - Scroll down to "Attach binaries by dropping them here or selecting them"
   - Drag and drop these 4 files from your `Dataset/` folder:
     - `supplier_orders_week1_new.xlsx`
     - `supplier_orders_week2_new.xlsx`
     - `supplier_orders_week3_new.xlsx`
     - `supplier_orders_week4_new.xlsx`

6. **Click "Publish release"** (green button at the bottom)

### 3️⃣ Update Your Download Scripts

After publishing, update the placeholder in both scripts:

**In `download-datasets.ps1` (line 11):**
```powershell
$GITHUB_USERNAME = "YOUR_ACTUAL_USERNAME"  # Replace this!
```

**In `download-datasets.sh` (line 11):**
```bash
GITHUB_USERNAME="YOUR_ACTUAL_USERNAME"  # Replace this!
```

Then commit and push the update:
```bash
git add download-datasets.ps1 download-datasets.sh
git commit -m "Update GitHub username in download scripts"
git push origin main
```

### 4️⃣ Test the Download

Test that users can download the datasets:

```bash
# Test the script
.\download-datasets.ps1
```

Or test direct download link in browser:
```
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week1_new.xlsx
```

---

## ✅ Direct Download Links (After Publishing)

Once your release is published, these will be the direct download URLs:

```
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week1_new.xlsx
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week2_new.xlsx
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week3_new.xlsx
https://github.com/YOUR_USERNAME/SupplyLens/releases/download/v1.0.0/supplier_orders_week4_new.xlsx
```

Share these links anywhere - in README, documentation, or with users!

---

## 📝 Tips

- ✅ Dataset files are now in `.gitignore` - they won't be committed
- ✅ Each GitHub release can host up to 2GB of files
- ✅ Direct download links work with `curl`, `wget`, and browsers
- ✅ You can update datasets by creating a new release (v1.0.1, v1.1.0, etc.)
- ✅ Old releases remain available unless you delete them

---

## 🎯 Summary

1. **Commit code** (datasets excluded automatically)
2. **Create GitHub Release** with tag `v1.0.0`
3. **Upload 4 Excel files** to the release
4. **Update scripts** with your GitHub username
5. **Share download links** with users

That's it! Your datasets are now easily downloadable without bloating your repository! 🎉
