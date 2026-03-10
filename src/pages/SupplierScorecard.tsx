import { useParams, Link } from "react-router-dom";
import { MOCK_SUPPLIERS, getGradeLabel } from "@/lib/supplierData";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";
import { ArrowLeft } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function getRecommendations(supplier: typeof MOCK_SUPPLIERS[0]): string[] {
  const recs: string[] = [];
  if (supplier.rejectRate > 3) recs.push("Audit supplier production quality processes.");
  if (supplier.otd < 80) recs.push("Investigate delivery delays and renegotiate contract terms.");
  if (supplier.fillRate < 90) recs.push("Review supplier capacity and consider backup vendor.");
  if (supplier.trend === 'Degrading') recs.push("Schedule performance review meeting with supplier.");
  if (supplier.grade === 'D') recs.push("Initiate transition to secondary supplier.");
  if (supplier.trend === 'Erratic') recs.push("Adjust procurement schedule to buffer variability.");
  if (recs.length === 0) recs.push("Continue monitoring. No immediate action required.");
  return recs;
}

export default function SupplierScorecard() {
  const { id } = useParams<{ id: string }>();
  const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);

  if (!supplier) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Supplier not found.</p>
        <Link to="/suppliers" className="text-primary text-sm hover:underline mt-2 inline-block">Back to suppliers</Link>
      </div>
    );
  }

  const chartData = [...supplier.weeklyScores].reverse();
  const recommendations = getRecommendations(supplier);

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/suppliers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </Link>

      {/* Header */}
      <div className="border border-border p-6 shadow-crisp mb-8">
        <div className="flex items-start gap-4">
          <GradeBadge grade={supplier.grade} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{supplier.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground font-mono">
              <span>ID: {supplier.id}</span>
              <span>Category: {supplier.category}</span>
              <span>Grade: {supplier.grade} ({getGradeLabel(supplier.grade)})</span>
            </div>
          </div>
          <TrendIndicator trend={supplier.trend} />
        </div>
      </div>

      {/* Metrics + Chart */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border border-border p-6 shadow-crisp space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">On-Time Delivery</span>
            <span className="font-mono font-bold text-foreground">{supplier.otd}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">Fill Rate</span>
            <span className="font-mono font-bold text-foreground">{supplier.fillRate}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">Quality Rejection</span>
            <span className={`font-mono font-bold ${supplier.rejectRate > 3 ? 'text-destructive' : 'text-foreground'}`}>{supplier.rejectRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Composite Score</span>
            <span className="font-mono font-bold text-foreground text-lg">{supplier.compositeScore} ({supplier.grade})</span>
          </div>
        </div>

        <div className="border border-border p-6 shadow-crisp">
          <h3 className="text-sm font-sans font-semibold text-foreground mb-4">Composite Score Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 14% 91%)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
              <Tooltip contentStyle={{ fontFamily: "'IBM Plex Mono'", fontSize: 12 }} />
              <Line type="monotone" dataKey="composite" stroke="hsl(220 100% 50%)" strokeWidth={2} dot={{ r: 4 }} name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="border border-border shadow-crisp mb-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              {['Metric', ...chartData.map(d => d.week)].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['otd', 'fillRate', 'rejectRate', 'composite'].map((key) => {
              const labels: Record<string, string> = {
                otd: 'On-Time Delivery (OTD %)',
                fillRate: 'Fill Rate (FR %)',
                rejectRate: 'Quality Rejection (QR %)',
                composite: 'Composite Score',
              };
              return (
                <tr key={key} className="border-b border-border">
                  <td className="px-4 py-3 font-sans font-medium text-foreground">{labels[key]}</td>
                  {chartData.map((d, i) => {
                    const val = d[key as keyof typeof d];
                    const isComposite = key === 'composite';
                    const numVal = typeof val === 'number' ? val : 0;
                    let textColor = 'text-foreground';
                    if (isComposite && numVal < 70) textColor = 'text-destructive';
                    else if (isComposite && numVal < 85) textColor = 'text-warning';
                    return (
                      <td key={i} className={`px-4 py-3 font-mono ${textColor}`}>
                        {isComposite ? `${val}` : `${val}%`}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="border border-border p-6 shadow-crisp">
        <h3 className="font-sans font-semibold text-foreground mb-4">System Recommendations</h3>
        <ul className="space-y-2">
          {recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-mono font-bold">{String(i + 1).padStart(2, '0')}</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
