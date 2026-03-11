import { useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { MOCK_SUPPLIERS, CATEGORIES, GRADES } from "@/lib/supplierData";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 15;

export default function Suppliers() {
  useDocumentTitle("Vendor Performance");
  const [category, setCategory] = useState("All Categories");
  const [grade, setGrade] = useState("All Grades");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = MOCK_SUPPLIERS.filter((s) => {
    if (category !== "All Categories" && s.category !== category) return false;
    if (grade !== "All Grades" && s.grade !== grade) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleCategory = (v: string) => { setCategory(v); setPage(1); };
  const handleGrade = (v: string) => { setGrade(v); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Vendor Performance Overview</h1>
      <p className="text-sm text-muted-foreground mb-8">Track and evaluate supplier performance over the past six months.</p>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select value={category} onChange={(e) => handleCategory(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={grade} onChange={(e) => handleGrade(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground">
          {GRADES.map((g) => <option key={g}>{g}</option>)}
        </select>
        <input type="text" placeholder="Search supplier..." value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 px-3 border border-border rounded text-sm font-sans bg-background text-foreground w-56" />
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {filtered.length} of {MOCK_SUPPLIERS.length} entries
        </span>
      </div>

      {/* Table */}
      <div className="border border-border shadow-crisp overflow-hidden rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              {['ID', 'Supplier Name', 'Category', 'OTD %', 'Fill Rate %', 'Reject %', 'Trend (Last 30D)', 'Score', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
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
                  <Link to={`/suppliers/${s.id}`}
                    className="inline-flex items-center justify-center h-7 px-3 bg-primary text-primary-foreground text-xs font-sans font-medium rounded hover:opacity-90 transition-opacity">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground font-mono">
            Page {page} of {totalPages} · showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`h-8 w-8 flex items-center justify-center rounded text-xs font-mono border transition-colors ${
                      page === p
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:bg-card'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
