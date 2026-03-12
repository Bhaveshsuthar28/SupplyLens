import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon, FileSpreadsheet, Check, AlertCircle,
  ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus,
  AlertTriangle, ShieldAlert, LayoutDashboard,
} from "lucide-react";
import { useUploadContext } from "@/context/UploadContext";

// ── Small helpers ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    success: "bg-success/10 text-success border-success/30",
    partial:  "bg-warning/10 text-warning border-warning/30",
    failed:   "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-block border px-2 py-0.5 text-xs font-mono rounded ${styles[status] ?? styles.failed}`}>
      {status?.toUpperCase()}
    </span>
  );
}

function RatingBadge({ rating }) {
  const styles = {
    A: "bg-success/10 text-success border-success/30",
    B: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    C: "bg-warning/10 text-warning border-warning/30",
    D: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return rating ? (
    <span className={`inline-block border px-2 py-0.5 text-xs font-mono font-bold rounded ${styles[rating] ?? ""}`}>
      {rating}
    </span>
  ) : null;
}

function RiskBadge({ level }) {
  const styles = {
    Low:      "bg-success/10 text-success",
    Medium:   "bg-blue-500/10 text-blue-500",
    High:     "bg-warning/10 text-warning",
    Critical: "bg-destructive/10 text-destructive",
    Unknown:  "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono rounded ${styles[level] ?? ""}`}>
      {level}
    </span>
  );
}

function TrendIcon({ direction }) {
  if (direction === "Improving")  return <TrendingUp  className="w-3 h-3 text-success" />;
  if (direction === "Declining")  return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
}

function CollapsibleSection({ title, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-sans font-semibold text-foreground bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2">{title} {badge}</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

// ── Preprocessing Report ───────────────────────────────────────────────────────
function PreprocessingReport({ report }) {
  if (!report) return null;
  const hasMissing  = Object.keys(report.missing_fixes  ?? {}).length > 0;
  const hasMappings = Object.keys(report.column_mapping ?? {}).length > 0;
  const hasDropped  = (report.dropped_rows ?? []).length > 0;
  const hasWarnings = (report.warnings ?? []).length > 0;
  const hasUnknown  = (report.unknown_columns_ignored ?? []).length > 0;

  return (
    <div className="mt-1">
      {hasWarnings && (
        <div className="mb-2 space-y-1">
          {report.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-warning font-mono bg-warning/5 border border-warning/20 px-3 py-2 rounded">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{w}
            </div>
          ))}
        </div>
      )}

      {hasMappings && (
        <CollapsibleSection title={`Column Mappings (${Object.keys(report.column_mapping).length})`}>
          <div className="space-y-1">
            {Object.entries(report.column_mapping).map(([from, to]) => (
              <div key={from} className="text-xs font-mono flex gap-2">
                <span className="text-muted-foreground">{from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-foreground font-semibold">{to}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {hasMissing && (
        <CollapsibleSection title={`Missing Values Fixed (${Object.keys(report.missing_fixes).length} column(s))`} defaultOpen>
          <div className="space-y-1">
            {Object.entries(report.missing_fixes).map(([col, action]) => (
              <div key={col} className="text-xs font-mono">
                <span className="text-foreground font-semibold">{col}</span>
                <span className="text-muted-foreground"> {action}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {hasUnknown && (
        <CollapsibleSection title={`Unknown Columns Ignored (${report.unknown_columns_ignored.length})`}>
          <div className="flex flex-wrap gap-2">
            {report.unknown_columns_ignored.map((c) => (
              <span key={c} className="text-xs font-mono border border-border px-2 py-0.5 text-muted-foreground">{c}</span>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {hasDropped && (
        <CollapsibleSection title={`Dropped Rows (${report.dropped_rows.length})`}>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {report.dropped_rows.map((r, i) => (
              <div key={i} className="text-xs font-mono flex gap-2">
                <span className="text-muted-foreground">Row {r.row_number}</span>
                <span className="text-destructive">{r.reason}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}

// ── Analytics Report ───────────────────────────────────────────────────────────
function AnalyticsReport({ analytics }) {
  if (!analytics) return null;
  const dist = analytics.rating_distribution ?? {};
  const total = analytics.total_suppliers ?? 0;
  if (total === 0) return null;

  return (
    <div className="mt-3 border border-border p-4">
      <p className="text-xs font-sans font-semibold text-foreground mb-3">Rating Distribution</p>
      <div className="grid grid-cols-4 gap-3">
        {["A", "B", "C", "D"].map((r) => (
          <div key={r} className="text-center">
            <RatingBadge rating={r} />
            <div className="font-mono font-bold text-xl text-foreground mt-1">{dist[r] ?? 0}</div>
            <div className="text-xs text-muted-foreground">
              {total > 0 ? Math.round(((dist[r] ?? 0) / total) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Risk & Trend Report ────────────────────────────────────────────────────────
function TrendForecastReport({ tf }) {
  if (!tf) return null;
  const { batch_summary, supplier_results } = tf;
  if (!supplier_results?.length) return null;

  const alerts = supplier_results.filter(
    (s) => s.risk?.risk_level === "Critical" || s.risk?.risk_level === "High" || s.trend?.silent_drop_flag
  );
  const silentDrops = supplier_results.filter((s) => s.trend?.silent_drop_flag);

  return (
    <>
      {/* Silent drop alerts */}
      {silentDrops.length > 0 && (
        <div className="mt-3 space-y-1">
          {silentDrops.map((s) => (
            <div key={s.supplier_id} className="flex items-start gap-2 text-xs font-mono bg-destructive/5 border border-destructive/20 px-3 py-2 rounded text-destructive">
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="font-semibold">{s.supplier_id}</span>
              <span>{s.trend.silent_drop_alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Risk summary */}
      {(batch_summary.critical_risk_count > 0 || batch_summary.high_risk_count > 0) && (
        <CollapsibleSection
          title="Risk Alerts"
          defaultOpen
          badge={
            <span className="text-xs font-mono text-destructive">
              {batch_summary.critical_risk_count} Critical · {batch_summary.high_risk_count} High
            </span>
          }
        >
          <div className="space-y-2">
            {alerts.map((s) => (
              <div key={s.supplier_id} className="flex items-start justify-between gap-3 text-xs border-b border-border pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldAlert className="w-3 h-3 text-destructive shrink-0" />
                  <span className="font-mono font-semibold text-foreground">{s.supplier_id}</span>
                  <span className="text-muted-foreground truncate">{s.supplier_name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <RatingBadge rating={s.score?.rating} />
                  <RiskBadge level={s.risk?.risk_level} />
                  <TrendIcon direction={s.trend?.wow_direction} />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* All suppliers trend table */}
      <CollapsibleSection title={`All Suppliers (${supplier_results.length})`}>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-mono text-muted-foreground pb-1 border-b border-border mb-1">
            <span>ID</span><span>Score</span><span>Rating</span><span>Trend</span><span>Risk</span>
          </div>
          {supplier_results.map((s) => (
            <div key={s.supplier_id} className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-mono items-center">
              <span className="text-foreground font-semibold">{s.supplier_id}</span>
              <span className="text-foreground">{s.score?.composite_score ?? "—"}</span>
              <RatingBadge rating={s.score?.rating} />
              <span className="flex items-center gap-1">
                <TrendIcon direction={s.trend?.wow_direction} />
                <span className="text-muted-foreground">{s.trend?.trend_30d ?? "—"}</span>
              </span>
              <RiskBadge level={s.risk?.risk_level} />
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const navigate = useNavigate();
  const { file, uploading, jobId, result, error, selectFile, startUpload } = useUploadContext();

  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  }, [selectFile]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Data Ingestion</h1>
      <p className="text-sm text-muted-foreground mb-8">Upload CSV or Excel files containing procurement data.</p>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed p-8 sm:p-16 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}
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

      {/* File info + upload button */}
      {file && (
        <div className="border border-border p-4 mt-6 shadow-crisp flex flex-wrap items-center justify-between gap-3">
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
              onClick={startUpload}
              disabled={uploading}
              className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {jobId ? "Analyzing in background…" : "Queueing…"}
                </span>
              ) : "Upload & Process"}
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-4 border border-border p-5 shadow-crisp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans font-semibold text-foreground text-sm">Pipeline Results</h3>
            <StatusBadge status={result.status} />
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="text-center">
              <div className="font-mono font-bold text-2xl text-foreground">{result.rows_processed ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Rows Processed</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl text-success">{result.suppliers_upserted ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Suppliers Updated</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl text-destructive">
                {Array.isArray(result.errors) ? result.errors.length : (result.errors ?? 0)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Rows Dropped</div>
            </div>
          </div>

          {result.message && (
            <p className="mt-3 text-xs text-muted-foreground font-mono">{result.message}</p>
          )}

          {/* Quick-navigate to dashboard / suppliers */}
          {result.status !== "failed" && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground text-xs font-sans font-medium rounded hover:opacity-90 transition-opacity"
              >
                <LayoutDashboard className="w-3 h-3" />
                View Dashboard
              </button>
              <button
                onClick={() => navigate("/suppliers")}
                className="inline-flex items-center gap-1.5 h-8 px-3 border border-border text-xs font-sans font-medium rounded hover:bg-card transition-colors text-foreground"
              >
                View Suppliers
              </button>
            </div>
          )}

          {/* Agent 1 — Preprocessing report */}
          {result.preprocessing && (
            <CollapsibleSection
              title="Agent 1 — Preprocessing"
              defaultOpen={result.preprocessing.rows_dropped > 0}
              badge={
                <span className="text-xs font-mono text-muted-foreground">
                  DQ {result.preprocessing.data_quality_score}%
                </span>
              }
            >
              <PreprocessingReport report={result.preprocessing} />
            </CollapsibleSection>
          )}

          {/* Agent 2 — Analytics */}
          {result.analytics && (
            <CollapsibleSection
              title="Agent 2 — Analytics"
              defaultOpen
              badge={
                <span className="text-xs font-mono text-muted-foreground">
                  {result.analytics.total_suppliers} suppliers rated
                </span>
              }
            >
              <AnalyticsReport analytics={result.analytics} />
            </CollapsibleSection>
          )}

          {/* Agent 3 — Trend & Forecast */}
          {result.trend_forecast && (
            <CollapsibleSection
              title="Agent 3 — Trend & Forecast"
              defaultOpen={
                (result.trend_forecast.batch_summary?.critical_risk_count ?? 0) > 0 ||
                (result.trend_forecast.batch_summary?.silent_drop_count ?? 0) > 0
              }
              badge={
                result.trend_forecast.batch_summary?.critical_risk_count > 0 ? (
                  <span className="text-xs font-mono text-destructive">
                    {result.trend_forecast.batch_summary.critical_risk_count} critical
                  </span>
                ) : null
              }
            >
              <TrendForecastReport tf={result.trend_forecast} />
            </CollapsibleSection>
          )}
        </div>
      )}

      {/* Expected columns reference */}
      <div className="border border-border p-6 mt-8 shadow-crisp">
        <h3 className="font-sans font-semibold text-foreground mb-3">Expected Data Columns</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["Supplier_ID", "Supplier_Name", "Category", "PO_Date", "Delivery_Date",
            "Expected_Delivery_Date", "Ordered_Qty", "Received_Qty", "Rejected_Qty"].map((col) => (
            <span key={col} className="text-xs font-mono text-muted-foreground border border-border px-2 py-1">{col}</span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 font-mono">
          Column names are auto-detected — VendorID, due_date, quantity_ordered etc. are all accepted.
        </p>
      </div>
    </div>
  );
}
