import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

const defaultWeights = { otd: 40, fillRate: 30, quality: 30 };

const STORAGE_KEY = "supplylens_weights";

function loadWeights() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultWeights;
}

function saveWeights(w) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {}
}
const gradeTiers = [
  { grade: 'A', range: '95–100', label: 'Strategic Partner', color: 'bg-success' },
  { grade: 'B', range: '85–94', label: 'Reliable', color: 'bg-primary' },
  { grade: 'C', range: '70–84', label: 'Needs Intervention', color: 'bg-warning' },
  { grade: 'D', range: '< 70', label: 'Critical Risk / Replace', color: 'bg-destructive' },
];

function DeltaBadge({ delta }) {
  if (delta == null) return <span className="text-xs font-mono text-muted-foreground">—</span>;
  if (delta > 0) return <span className="inline-flex items-center gap-0.5 text-xs font-mono text-success"><TrendingUp className="w-3 h-3" />+{delta}</span>;
  if (delta < 0) return <span className="inline-flex items-center gap-0.5 text-xs font-mono text-destructive"><TrendingDown className="w-3 h-3" />{delta}</span>;
  return <span className="inline-flex items-center gap-0.5 text-xs font-mono text-muted-foreground"><Minus className="w-3 h-3" />0</span>;
}

function RatingPill({ r }) {
  const cls = { A: "bg-success/10 text-success border-success/30", B: "bg-primary/10 text-primary border-primary/30", C: "bg-warning/10 text-warning border-warning/30", D: "bg-destructive/10 text-destructive border-destructive/30" };
  return r ? <span className={`border px-1.5 py-0.5 text-xs font-mono font-bold rounded ${cls[r] ?? ""}`}>{r}</span> : <span className="text-xs text-muted-foreground">—</span>;
}

export default function Metrics() {
  const queryClient = useQueryClient();
  const [weights, setWeights]               = useState(loadWeights);
  const [appliedWeights, setAppliedWeights] = useState(loadWeights);
  const [recalculating, setRecalculating]   = useState(false);
  const [impact, setImpact]                 = useState(null);
  const [recalcError, setRecalcError]       = useState(null);

  const { data: summary } = useQuery({
    queryKey: queryKeys.metrics.summary(),
    queryFn:  () => api.get("/api/v1/metrics/summary"),
  });

  const total   = weights.otd + weights.fillRate + weights.quality;
  const isValid = total === 100;

  const handleChange = (key, value) => {
    setWeights((w) => ({ ...w, [key]: parseInt(value) || 0 }));
    setImpact(null);
    setRecalcError(null);
  };

  const handleConfirm = async () => {
    if (!isValid || recalculating) return;
    setRecalculating(true);
    setImpact(null);
    setRecalcError(null);
    try {
      const toFrac = (w) => ({
        weight_otd: w.otd      / 100,
        weight_fr:  w.fillRate / 100,
        weight_qr:  w.quality  / 100,
      });
      const result = await api.post("/api/v1/metrics/recalculate", {
        new_weights: toFrac(weights),
        old_weights: toFrac(appliedWeights),
      });
      setImpact(result.impact_summary);
      setAppliedWeights({ ...weights });
      saveWeights({ ...weights });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.metrics.all() }),
      ]);
    } catch (err) {
      setRecalcError(err.message);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Evaluation Metrics</h1>
      <p className="text-sm text-muted-foreground mb-8">Define how supplier performance is measured and scored.</p>

      {/* Live Summary */}
      {summary && (
        <div className="border border-border p-5 shadow-crisp mb-8">
          <h3 className="font-sans font-semibold text-foreground mb-4 text-sm">Live Database Summary</h3>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <div className="font-mono font-bold text-xl text-foreground">{summary.total_suppliers}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Suppliers</div>
            </div>
            <div>
              <div className="font-mono font-bold text-xl text-success">{summary.avg_otd}%</div>
              <div className="text-xs text-muted-foreground mt-1">Avg OTD</div>
            </div>
            <div>
              <div className="font-mono font-bold text-xl text-primary">{summary.avg_fill_rate}%</div>
              <div className="text-xs text-muted-foreground mt-1">Avg Fill Rate</div>
            </div>
            <div>
              <div className="font-mono font-bold text-xl text-destructive">{summary.avg_reject_rate}%</div>
              <div className="text-xs text-muted-foreground mt-1">Avg Reject Rate</div>
            </div>
            <div>
              <div className="font-mono font-bold text-xl text-foreground">{summary.avg_composite_score}</div>
              <div className="text-xs text-muted-foreground mt-1">Avg Score</div>
            </div>
          </div>
          {summary.grade_distribution && Object.keys(summary.grade_distribution).length > 0 && (
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground font-sans">Grade Distribution:</span>
              {['A', 'B', 'C', 'D'].map((g) => (
                <span key={g} className="text-xs font-mono text-foreground">
                  {g}: <span className="font-bold">{summary.grade_distribution[g] ?? 0}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Current Applied Weights */}
        <div className="border border-border p-6 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-4">Applied Weights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">On-Time Delivery (OTD)</span>
              <span className="font-mono font-bold text-foreground">{appliedWeights.otd}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fill Rate (FR)</span>
              <span className="font-mono font-bold text-foreground">{appliedWeights.fillRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quality Rejection (QR)</span>
              <span className="font-mono font-bold text-foreground">{appliedWeights.quality}%</span>
            </div>
          </div>

          <h4 className="font-sans font-semibold text-foreground mt-6 mb-3 text-sm">Composite Score Tiers</h4>
          <div className="space-y-2">
            {gradeTiers.map((g) => (
              <div key={g.grade} className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold text-primary-foreground ${g.color}`}>{g.grade}</span>
                <span className="font-mono text-xs text-foreground">{g.range}</span>
                <span className="text-xs text-muted-foreground">({g.label})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Update Weights */}
        <div className="border border-border p-6 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-4">Update Weights</h3>
          <div className="space-y-4">
            {[
              { key: 'otd', label: 'On-Time Delivery (OTD)' },
              { key: 'fillRate', label: 'Fill Rate (FR)' },
              { key: 'quality', label: 'Quality Rejection (QR)' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={weights[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-16 h-9 px-2 border border-border rounded text-sm font-mono text-right bg-background text-foreground"
                    min={0}
                    max={100}
                  />
                  <span className="text-sm text-muted-foreground font-mono">%</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 text-xs font-mono ${isValid ? 'text-success' : 'text-destructive'}`}>
            Total: {total}% {isValid ? '✓' : '(must equal 100%)'}
          </div>

          {recalcError && (
            <div className="mt-3 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive font-mono">
              {recalcError}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!isValid || recalculating}
            className="mt-6 w-full inline-flex items-center justify-center h-10 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {recalculating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Recalculating…
              </span>
            ) : impact ? 'Applied ✓' : 'Confirm & Recalculate'}
          </button>
        </div>
      </div>

      {/* Impact Summary */}
      {impact && (
        <div className="mt-8 border border-border p-6 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-5 text-sm">Recalculation Impact</h3>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4 text-center mb-6">
            <div>
              <div className="font-mono font-bold text-2xl text-foreground">{impact.total_records_recalculated}</div>
              <div className="text-xs text-muted-foreground mt-1">Records Updated</div>
            </div>
            <div>
              <div className="font-mono font-bold text-2xl text-foreground">{impact.total_suppliers_affected}</div>
              <div className="text-xs text-muted-foreground mt-1">Suppliers Affected</div>
            </div>
            <div>
              <div className="font-mono font-bold text-2xl text-foreground">{impact.records_rating_changed}</div>
              <div className="text-xs text-muted-foreground mt-1">Ratings Changed</div>
            </div>
            <div>
              <div className={`font-mono font-bold text-2xl ${impact.avg_score_delta > 0 ? 'text-success' : impact.avg_score_delta < 0 ? 'text-destructive' : 'text-foreground'}`}>
                {impact.avg_score_delta > 0 ? '+' : ''}{impact.avg_score_delta}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Avg Score Δ</div>
            </div>
          </div>

          {/* Old vs New distribution */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {[
              { label: 'Previous Distribution', dist: impact.old_rating_distribution },
              { label: 'New Distribution', dist: impact.new_rating_distribution },
            ].map(({ label, dist }) => (
              <div key={label}>
                <p className="text-xs font-sans font-semibold text-muted-foreground mb-2">{label}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {['A', 'B', 'C', 'D'].map((r) => (
                    <div key={r}>
                      <RatingPill r={r} />
                      <div className="font-mono font-bold text-lg text-foreground mt-1">{dist?.[r] ?? 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Rating changes table */}
          {impact.rating_changes?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                <p className="text-xs font-sans font-semibold text-foreground">Rating Changes ({impact.rating_changes.length})</p>
              </div>
              <div className="border border-border rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-card border-b border-border">
                      {['Supplier', 'Week', 'Old', 'New', 'Δ Score'].map((h) => (
                        <th key={h} className="text-left px-3 py-2 font-sans font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {impact.rating_changes.slice(0, 20).map((rc, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-card transition-colors">
                        <td className="px-3 py-2 font-sans text-foreground">{rc.supplier_name} <span className="text-muted-foreground font-mono">({rc.supplier_id})</span></td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">{rc.week_start_date}</td>
                        <td className="px-3 py-2"><RatingPill r={rc.old_rating} /></td>
                        <td className="px-3 py-2"><RatingPill r={rc.new_rating} /></td>
                        <td className="px-3 py-2"><DeltaBadge delta={rc.score_delta} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {impact.rating_changes.length > 20 && (
                  <p className="text-xs text-muted-foreground font-mono px-3 py-2 border-t border-border">
                    + {impact.rating_changes.length - 20} more rows
                  </p>
                )}
              </div>
            </div>
          )}

          {impact.rating_changes?.length === 0 && (
            <p className="text-xs text-muted-foreground font-mono">No rating changes — all suppliers remain in the same tier.</p>
          )}
        </div>
      )}
    </div>
  );
}
