import { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_SUPPLIERS, CATEGORIES, GRADES } from "@/lib/supplierData";
import { KPICard } from "@/components/KPICard";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";
import { Clock, Package, ShieldAlert, BarChart3 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const trendData = [
  { month: "Jan", otd: 91, fillRate: 93, reject: 1.8 },
  { month: "Feb", otd: 92, fillRate: 94, reject: 1.6 },
  { month: "Mar", otd: 90, fillRate: 92, reject: 2.1 },
  { month: "Apr", otd: 93, fillRate: 95, reject: 1.4 },
  { month: "May", otd: 91, fillRate: 93, reject: 1.9 },
  { month: "Jun", otd: 94, fillRate: 96, reject: 1.2 },
];

const comparisonData = MOCK_SUPPLIERS.slice(0, 8).map((s) => ({
  name: s.name.split(' ')[0],
  score: s.compositeScore,
}));

export default function Dashboard() {
  const [category, setCategory] = useState("All Categories");
  const [grade, setGrade] = useState("All Grades");
  const [search, setSearch] = useState("");

  const avgOTD = (MOCK_SUPPLIERS.reduce((a, s) => a + s.otd, 0) / MOCK_SUPPLIERS.length).toFixed(1);
  const avgFR = (MOCK_SUPPLIERS.reduce((a, s) => a + s.fillRate, 0) / MOCK_SUPPLIERS.length).toFixed(1);
  const avgReject = (MOCK_SUPPLIERS.reduce((a, s) => a + s.rejectRate, 0) / MOCK_SUPPLIERS.length).toFixed(1);
  const avgScore = Math.round(MOCK_SUPPLIERS.reduce((a, s) => a + s.compositeScore, 0) / MOCK_SUPPLIERS.length);

  const filtered = MOCK_SUPPLIERS.filter((s) => {
    if (category !== "All Categories" && s.category !== category) return false;
    if (grade !== "All Grades" && s.grade !== grade) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Supplier performance overview across all categories.</p>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-px bg-border border border-border mb-8">
        <KPICard label="On-Time Delivery" value={`${avgOTD}%`} icon={<Clock className="w-4 h-4" />} />
        <KPICard label="Fill Rate" value={`${avgFR}%`} icon={<Package className="w-4 h-4" />} />
        <KPICard label="Quality Rejection" value={`${avgReject}%`} icon={<ShieldAlert className="w-4 h-4" />} />
        <KPICard label="Avg Composite Score" value={`${avgScore}`} icon={<BarChart3 className="w-4 h-4" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border border-border p-6 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-4 text-sm">Delivery Performance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 14% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "'IBM Plex Mono'" }} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 12, fontFamily: "'IBM Plex Mono'" }} />
              <Tooltip contentStyle={{ fontFamily: "'IBM Plex Mono'", fontSize: 12 }} />
              <Line type="monotone" dataKey="otd" stroke="hsl(220 100% 50%)" strokeWidth={2} dot={{ r: 3 }} name="OTD %" />
              <Line type="monotone" dataKey="fillRate" stroke="hsl(142 72% 36%)" strokeWidth={2} dot={{ r: 3 }} name="Fill Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-border p-6 shadow-crisp">
          <h3 className="font-sans font-semibold text-foreground mb-4 text-sm">Supplier Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 14% 91%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fontFamily: "'IBM Plex Mono'" }} />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
              <Tooltip contentStyle={{ fontFamily: "'IBM Plex Mono'", fontSize: 12 }} />
              <Bar dataKey="score" fill="hsl(220 100% 50%)" name="Composite Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground"
        >
          {GRADES.map((g) => <option key={g}>{g}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground w-56"
        />
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {filtered.length} of {MOCK_SUPPLIERS.length} suppliers
        </span>
      </div>

      {/* Table */}
      <div className="border border-border shadow-crisp overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              {['ID', 'Supplier Name', 'Category', 'OTD %', 'Fill Rate %', 'Reject %', 'Trend', 'Score', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border hover:bg-card transition-colors">
                <td className="px-4 py-3 font-mono text-muted-foreground">{s.id}</td>
                <td className="px-4 py-3 font-sans font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3 font-sans text-muted-foreground">{s.category}</td>
                <td className="px-4 py-3 font-mono">{s.otd}%</td>
                <td className="px-4 py-3 font-mono">{s.fillRate}%</td>
                <td className="px-4 py-3 font-mono">{s.rejectRate}%</td>
                <td className="px-4 py-3"><TrendIndicator trend={s.trend} /></td>
                <td className="px-4 py-3"><GradeBadge grade={s.grade} size="sm" /></td>
                <td className="px-4 py-3">
                  <Link
                    to={`/suppliers/${s.id}`}
                    className="text-xs font-sans font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
