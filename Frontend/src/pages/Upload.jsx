import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { api } from "@/lib/apiClient";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setResult(null); setError(null); }
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setResult(null); setError(null); }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await api.upload("/api/v1/upload/", formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Data Ingestion</h1>
      <p className="text-sm text-muted-foreground mb-8">Upload CSV or Excel files containing procurement data.</p>

      <div
        className={`border-2 border-dashed p-16 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UploadIcon className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or</p>
        <label className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground text-sm font-sans font-medium rounded cursor-pointer hover:opacity-90 transition-opacity">
          Browse Files
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
        </label>
        <p className="text-xs text-muted-foreground mt-3 font-mono">Supported: .csv, .xlsx, .xls</p>
      </div>

      {file && (
        <div className="border border-border p-4 mt-6 shadow-crisp flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-sans font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          {result ? (
            <span className="inline-flex items-center gap-1 text-sm text-success font-sans font-medium">
              <Check className="w-4 h-4" /> Processed
            </span>
          ) : (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing…
                </span>
              ) : (
                "Upload & Process"
              )}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 border border-border p-5 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-3 text-sm">Upload Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-mono font-bold text-2xl text-foreground">{result.rows_processed ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Rows Processed</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl text-success">{result.suppliers_upserted ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Suppliers Updated</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl text-destructive">{result.errors ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Errors</div>
            </div>
          </div>
          {result.message && (
            <p className="mt-3 text-xs text-muted-foreground font-mono">{result.message}</p>
          )}
        </div>
      )}

      <div className="border border-border p-6 mt-8 shadow-crisp">
        <h3 className="font-sans font-semibold text-foreground mb-3">Expected Data Columns</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Supplier_ID', 'Supplier_Name', 'Category', 'PO_Date', 'Delivery_Date', 'Expected_Delivery_Date', 'Ordered_Qty', 'Received_Qty', 'Rejected_Qty'].map((col) => (
            <span key={col} className="text-xs font-mono text-muted-foreground border border-border px-2 py-1">{col}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
