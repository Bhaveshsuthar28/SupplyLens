import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileSpreadsheet, Check } from "lucide-react";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setUploaded(false); }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setUploaded(false); }
  };

  const handleUpload = () => {
    if (file) setUploaded(true);
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
          {uploaded ? (
            <span className="inline-flex items-center gap-1 text-sm text-success font-sans font-medium">
              <Check className="w-4 h-4" /> Processed
            </span>
          ) : (
            <button
              onClick={handleUpload}
              className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity"
            >
              Upload & Process
            </button>
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
