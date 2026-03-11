import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";

const defaultWeights = { otd: 40, fillRate: 30, quality: 30 };
const gradeTiers = [
  { grade: 'A', range: '95–100', label: 'Strategic Partner', color: 'bg-success' },
  { grade: 'B', range: '85–94', label: 'Reliable', color: 'bg-primary' },
  { grade: 'C', range: '70–84', label: 'Needs Intervention', color: 'bg-warning' },
  { grade: 'D', range: '< 70', label: 'Critical Risk / Replace', color: 'bg-destructive' },
];

export default function Metrics() {
  const [weights, setWeights] = useState(defaultWeights);
  const [saved, setSaved] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/api/v1/metrics/summary")
      .then((data) => setSummary(data))
      .catch(() => {});
  }, []);

  const total = weights.otd + weights.fillRate + weights.quality;
  const isValid = total === 100;

  const handleChange = (key, value) => {
    const num = parseInt(value) || 0;
    setWeights((w) => ({ ...w, [key]: num }));
    setSaved(false);
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
        {/* Current */}
        <div className="border border-border p-6 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-4">Current Weights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">On-Time Delivery (OTD)</span>
              <span className="font-mono font-bold text-foreground">{defaultWeights.otd}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fill Rate (FR)</span>
              <span className="font-mono font-bold text-foreground">{defaultWeights.fillRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quality Rejection (QR)</span>
              <span className="font-mono font-bold text-foreground">{defaultWeights.quality}%</span>
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

        {/* New */}
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

          <button
            onClick={() => isValid && setSaved(true)}
            disabled={!isValid}
            className="mt-6 w-full inline-flex items-center justify-center h-10 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? 'Saved ✓' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
