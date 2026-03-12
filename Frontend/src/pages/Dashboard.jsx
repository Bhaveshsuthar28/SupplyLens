import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, GRADES } from "@/lib/supplierData";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend,
  AreaChart, Area,
} from "recharts";
import { toast } from "sonner";
import { BarChart3, Users, TrendingUp, AlertTriangle, Download, Filter } from "lucide-react";
import { api } from "@/lib/apiClient";
import { normalizeSupplierList } from "@/lib/normalizers";
import { queryKeys } from "@/lib/queryKeys";

const GRADE_COLORS = {
  A: "hsl(142, 72%, 36%)",
  B: "hsl(45, 100%, 51%)",
  C: "hsl(30, 100%, 50%)",
  D: "hsl(350, 80%, 43%)",
};

const CATEGORY_COLORS = [
  "hsl(220, 100%, 50%)",
  "hsl(142, 72%, 36%)",
  "hsl(30, 100%, 50%)",
  "hsl(350, 80%, 43%)",
];

export default function Dashboard() {
  const [category, setCategory] = useState("All Categories");
  const [grade, setGrade] = useState("All Grades");
  const [timePeriod, setTimePeriod] = useState("Last 6 Months");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: suppliers = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.suppliers.all(),
    queryFn:  () =>
      api.get("/api/v1/suppliers/?page=1&page_size=500")
        .then((r) => normalizeSupplierList(r.data)),
  });

  const filtered = useMemo(() => suppliers.filter((s) => {
    if (category !== "All Categories" && s.category !== category) return false;
    if (grade !== "All Grades" && s.grade !== grade) return false;
    return true;
  }), [category, grade, suppliers]);

  const avgOTD = filtered.length ? (filtered.reduce((a, s) => a + s.otd, 0) / filtered.length).toFixed(1) : "0.0";
  const avgFR = filtered.length ? (filtered.reduce((a, s) => a + s.fillRate, 0) / filtered.length).toFixed(1) : "0.0";
  const avgReject = filtered.length ? (filtered.reduce((a, s) => a + s.rejectRate, 0) / filtered.length).toFixed(1) : "0.0";

  // Rejection Rate Distribution
  const rejectionDist = useMemo(() => {
    const buckets = [
      { range: "0-1%", count: 0, color: GRADE_COLORS.A },
      { range: "1-3%", count: 0, color: GRADE_COLORS.B },
      { range: "3-5%", count: 0, color: GRADE_COLORS.C },
      { range: "5-10%", count: 0, color: GRADE_COLORS.D },
      { range: ">10%", count: 0, color: "hsl(350, 80%, 30%)" },
    ];
    filtered.forEach((s) => {
      if (s.rejectRate <= 1) buckets[0].count++;
      else if (s.rejectRate <= 3) buckets[1].count++;
      else if (s.rejectRate <= 5) buckets[2].count++;
      else if (s.rejectRate <= 10) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [filtered]);

  // OTD Distribution
  const otdDist = useMemo(() => {
    const buckets = [
      { range: "95-100%", count: 0, color: GRADE_COLORS.A },
      { range: "90-95%", count: 0, color: GRADE_COLORS.B },
      { range: "80-90%", count: 0, color: GRADE_COLORS.C },
      { range: "<80%", count: 0, color: GRADE_COLORS.D },
    ];
    filtered.forEach((s) => {
      if (s.otd >= 95) buckets[0].count++;
      else if (s.otd >= 90) buckets[1].count++;
      else if (s.otd >= 80) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [filtered]);

  // Performance Trend (from weekly scores)
  const performanceTrend = useMemo(() => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    return weeks.map((w) => {
      const scores = filtered.map((s) => s.weeklyScores.find((ws) => ws.week === w)?.composite || 0).filter(Boolean);
      return { week: w.replace("Week ", "W"), avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0 };
    });
  }, [filtered]);

  // Grade Distribution (donut)
  const gradeDistribution = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    filtered.forEach((s) => counts[s.grade]++);
    return Object.entries(counts).map(([g, count]) => ({
      name: g,
      value: count,
      percentage: filtered.length ? Math.round((count / filtered.length) * 100) : 0,
      color: GRADE_COLORS[g],
    }));
  }, [filtered]);

  // Category Performance
  const categoryPerformance = useMemo(() => {
    const cats = ["Raw Material", "Packaging", "Components", "Fasteners"];
    return cats.map((cat) => {
      const catSuppliers = filtered.filter((s) => s.category === cat);
      return {
        name: cat.length > 12 ? cat.substring(0, 10) + "..." : cat,
        fullName: cat,
        avg: catSuppliers.length ? Math.round(catSuppliers.reduce((a, s) => a + s.compositeScore, 0) / catSuppliers.length) : 0,
        count: catSuppliers.length,
      };
    }).filter((c) => c.count > 0);
  }, [filtered]);

  // Top Suppliers trend
  const topSuppliersTrend = useMemo(() => {
    const top5 = [...filtered].sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 5);
    return top5.map((s, i) => ({ name: i + 1, score: s.compositeScore, supplier: s.name }));
  }, [filtered]);

  // Risk Matrix (scatter)
  const riskMatrix = useMemo(() => {
    return filtered.map((s) => ({
      x: s.otd,
      y: s.compositeScore,
      z: s.rejectRate * 10,
      name: s.id,
      fullName: s.name,
      grade: s.grade,
      color: GRADE_COLORS[s.grade],
    }));
  }, [filtered]);

  // Top Quality Rejections by category
  const rejectionByCategory = useMemo(() => {
    const cats = ["Raw Material", "Packaging", "Components"];
    return cats.map((cat) => {
      const catSuppliers = filtered.filter((s) => s.category === cat);
      return {
        name: cat,
        avg: catSuppliers.length ? +(catSuppliers.reduce((a, s) => a + s.rejectRate, 0) / catSuppliers.length).toFixed(1) : 0,
      };
    });
  }, [filtered]);

  // Top rejectors table
  const topRejectors = useMemo(() => {
    return [...filtered]
      .sort((a, b) => b.rejectRate - a.rejectRate)
      .slice(0, 5)
      .map((s) => ({
        name: s.name,
        grade: s.grade,
        rejectRate: s.rejectRate,
        share: Math.round((s.rejectRate / filtered.reduce((a, ss) => a + ss.rejectRate, 0)) * 100),
      }));
  }, [filtered]);

  const handleExportCSV = () => {
    const headers = "ID,Name,Category,OTD%,Fill Rate%,Reject%,Score,Grade,Trend\n";
    const rows = filtered.map((s) => `${s.id},${s.name},${s.category},${s.otd},${s.fillRate},${s.rejectRate},${s.compositeScore},${s.grade},${s.trend}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supplier_analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const handleApplyFilters = () => {
    toast.success(`Filters applied: ${filtered.length} suppliers shown`);
  };

  const chartStyle = { fontSize: 11, fontFamily: "'IBM Plex Mono'" };

  if (loading) {
    return (
      <div className="p-6 bg-sidebar min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-sidebar min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Supplier Performance <span className="font-normal">Analytics Dashboard</span>
          </h1>
        </div>
        <button
          className="lg:hidden flex items-center gap-1.5 h-8 px-3 text-xs border border-primary text-primary rounded hover:bg-primary/10 transition-colors font-sans"
          onClick={() => setFiltersOpen((f) => !f)}
        >
          <Filter className="w-3 h-3" />
          Filters {filtersOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* Mobile filter panel */}
      {filtersOpen && (
        <div className="lg:hidden mb-5">
          <FilterPanel title="Filters">
            <FilterSelect label="All Categories" value={category} onChange={setCategory} options={CATEGORIES} />
            <FilterSelect label="All Grades" value={grade} onChange={setGrade} options={GRADES} />
            <FilterSelect label="Time Period" value={timePeriod} onChange={setTimePeriod} options={["Last 6 Months", "Last 3 Months", "Last Month", "Last Year"]} />
            <div className="flex gap-2 mt-3">
              <button onClick={handleApplyFilters} className="flex-1 h-8 bg-primary text-primary-foreground text-xs font-sans font-medium rounded hover:opacity-90 transition-opacity">
                Apply Filters
              </button>
              <button onClick={handleExportCSV} className="flex-1 h-8 border border-primary text-primary text-xs font-sans font-medium rounded hover:bg-primary/10 transition-colors flex items-center justify-center gap-1">
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>
          </FilterPanel>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        {/* Main content */}
        <div className="space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPIBox icon={<Users className="w-5 h-5 text-primary" />} label="Total Suppliers" value={`${filtered.length}`} />
            <KPIBox icon={<TrendingUp className="w-5 h-5 text-success" />} label="Avg On-Time Delivery" value={`${avgOTD}%`} valueColor="text-success" />
            <KPIBox icon={<BarChart3 className="w-5 h-5 text-primary" />} label="Avg Fill Rate" value={`${avgFR}%`} valueColor="text-primary" />
            <KPIBox icon={<AlertTriangle className="w-5 h-5 text-destructive" />} label="Avg Rejection Rate" value={`${avgReject}%`} valueColor="text-destructive" />
          </div>

          {/* Row 2: 3 charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ChartCard title="Rejection Rate Distribution">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rejectionDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis dataKey="range" tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <YAxis tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }} />
                  <Bar dataKey="count" name="Suppliers">
                    {rejectionDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="On-Time Delivery Distribution">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={otdDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis dataKey="range" tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <YAxis tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }} />
                  <Bar dataKey="count" name="Suppliers">
                    {otdDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Performance Trend">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis dataKey="week" tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <YAxis domain={["auto", "auto"]} tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(45,100%,51%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(45,100%,51%)" }} name="Avg Score" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 3: 3 charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ChartCard title="Supplier Score Distribution">
              <div className="flex items-center gap-3 min-h-[165px]">
                <div className="w-[130px] h-[165px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" nameKey="name" stroke="none">
                        {gradeDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 text-xs min-w-0">
                  {gradeDistribution.map((g) => (
                    <div key={g.name} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center text-white shrink-0" style={{ background: g.color }}>{g.name}</span>
                      <span className="text-sidebar-foreground font-mono truncate">{g.name} ···· {g.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Category Performance Overview">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis dataKey="name" tick={{ ...chartStyle, fontSize: 10 }} stroke="hsl(210,14%,50%)" />
                  <YAxis domain={[60, 100]} tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }} />
                  <Bar dataKey="avg" name="Avg Score">
                    {categoryPerformance.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Suppliers vs Rank">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={topSuppliersTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis dataKey="name" tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <YAxis domain={["auto", "auto"]} tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }}
                    formatter={(value, _, props) => [`${value} (${props.payload.supplier})`, "Score"]} />
                  <Line type="monotone" dataKey="score" stroke="hsl(45,100%,51%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(45,100%,51%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 4: Risk Matrix + Rejections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ChartCard title="Supplier Risk Matrix">
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis type="number" dataKey="x" name="OTD %" domain={[50, 100]} tick={chartStyle} stroke="hsl(210,14%,50%)" label={{ value: "On-Time Delivery (%)", position: "bottom", style: { ...chartStyle, fill: "hsl(210,14%,50%)" }, offset: -5 }} />
                  <YAxis type="number" dataKey="y" name="Score" domain={[50, 100]} tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <ZAxis type="number" dataKey="z" range={[40, 200]} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }}
                    formatter={(value, name) => [name === "OTD %" ? `${value}%` : value, name]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""} />
                  <Scatter data={riskMatrix} name="Suppliers">
                    {riskMatrix.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center">
                {["A", "B", "C", "D"].map((g) => (
                  <div key={g} className="flex items-center gap-1 text-[10px] text-sidebar-foreground">
                    <span className="w-3 h-3 rounded-full" style={{ background: GRADE_COLORS[g] }} />
                    {g === "A" ? "Low Risk" : g === "B" ? "Moderate" : g === "C" ? "High Risk" : "Critical"}
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Top Quality Rejections">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={rejectionByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,11%,25%)" />
                  <XAxis dataKey="name" tick={{ ...chartStyle, fontSize: 10 }} stroke="hsl(210,14%,50%)" />
                  <YAxis tick={chartStyle} stroke="hsl(210,14%,50%)" />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontFamily: "'IBM Plex Mono'", fontSize: 11, borderRadius: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.12)" }} />
                  <Bar dataKey="avg" name="Avg Reject %">
                    {rejectionByCategory.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? GRADE_COLORS.C : i === 1 ? GRADE_COLORS.D : GRADE_COLORS.B} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Quality Rejections">
              <div className="space-y-3">
                {topRejectors.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <GradeBadge grade={s.grade} size="sm" />
                    <span className="text-sidebar-foreground flex-1 truncate font-sans">{s.name}</span>
                    <span className="font-mono text-sidebar-foreground">{s.share}%</span>
                    <span className="font-mono font-bold" style={{ color: GRADE_COLORS[s.grade] }}>{s.rejectRate}%</span>
                    <TrendIndicator trend="Degrading" />
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Right Sidebar - Filters (desktop only) */}
        <div className="hidden lg:block space-y-5">
          <FilterPanel title="Filters">
            <FilterSelect label="All Categories" value={category} onChange={setCategory} options={CATEGORIES} />
            <FilterSelect label="All Grades" value={grade} onChange={setGrade} options={GRADES} />
            <FilterSelect label="Time Period" value={timePeriod} onChange={setTimePeriod} options={["Last 6 Months", "Last 3 Months", "Last Month", "Last Year"]} />
            <div className="flex gap-2 mt-3">
              <button onClick={handleApplyFilters} className="flex-1 h-8 bg-primary text-primary-foreground text-xs font-sans font-medium rounded hover:opacity-90 transition-opacity">
                Apply Filters
              </button>
              <button onClick={handleExportCSV} className="flex-1 h-8 border border-primary text-primary text-xs font-sans font-medium rounded hover:bg-primary/10 transition-colors flex items-center justify-center gap-1">
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>
          </FilterPanel>
        </div>
      </div>
    </div>
  );
}

function KPIBox({ icon, label, value, valueColor = "text-sidebar-foreground" }) {
  return (
    <div className="bg-sidebar-accent border border-sidebar-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-sidebar-foreground/70 font-sans">{label}</span>
      </div>
      <div className={`font-mono text-2xl font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-sidebar-accent border border-sidebar-border rounded-lg p-4">
      <h3 className="text-xs font-sans font-semibold text-sidebar-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

function FilterPanel({ title, children }) {
  return (
    <div className="bg-sidebar-accent border border-sidebar-border rounded-lg p-4">
      <h3 className="text-xs font-sans font-semibold text-sidebar-foreground mb-3 flex items-center gap-2">
        <Filter className="w-3 h-3" /> {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 px-3 bg-sidebar border border-sidebar-border rounded text-xs font-sans text-sidebar-foreground"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
