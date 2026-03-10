import { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_SUPPLIERS, CATEGORIES, GRADES } from "@/lib/supplierData";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";

export default function Suppliers() {
  const [category, setCategory] = useState("All Categories");
  const [grade, setGrade] = useState("All Grades");
  const [search, setSearch] = useState("");

  const filtered = MOCK_SUPPLIERS.filter((s) => {
    if (category !== "All Categories" && s.category !== category) return false;
    if (grade !== "All Grades" && s.grade !== grade) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Vendor Performance Overview</h1>
      <p className="text-sm text-muted-foreground mb-8">Track and evaluate supplier performance over the past six months.</p>

      <div className="flex items-center gap-3 mb-4">
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground">
          {GRADES.map((g) => <option key={g}>{g}</option>)}
        </select>
        <input type="text" placeholder="Search..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground w-56" />
        <span className="ml-auto text-xs text-muted-foreground font-mono">{filtered.length} of {MOCK_SUPPLIERS.length} entries</span>
      </div>

      <div className="border border-border shadow-crisp overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              {['ID', 'Supplier Name', 'Category', 'OTD %', 'Fill Rate %', 'Reject %', 'Trend (Last 30D)', 'Score', ''].map((h) => (
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
                  <Link to={`/suppliers/${s.id}`} className="inline-flex items-center justify-center h-7 px-3 bg-primary text-primary-foreground text-xs font-sans font-medium rounded hover:opacity-90 transition-opacity">
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
