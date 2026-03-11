import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CATEGORIES, GRADES } from "@/lib/supplierData";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/apiClient";
import { normalizeSupplierList } from "@/lib/normalizers";

const PAGE_SIZE = 15;

export default function Suppliers() {
  useDocumentTitle("Vendor Performance");
  const [category, setCategory] = useState("All Categories");
  const [grade, setGrade] = useState("All Grades");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, page_size: PAGE_SIZE });
      if (category !== "All Categories") params.set("category", category);
      if (grade !== "All Grades") params.set("grade", grade);
      if (search.trim()) params.set("search", search.trim());
      const result = await api.get(`/api/v1/suppliers/?${params}`);
      setSuppliers(normalizeSupplierList(result.data));
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, grade, search, page]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleCategory = (v) => { setCategory(v); setPage(1); };
  const handleGrade = (v) => { setGrade(v); setPage(1); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

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
          {total} entries
        </span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive">
          {error}
        </div>
      )}

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
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground text-sm">Loading…</td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground text-sm">No suppliers found.</td>
              </tr>
            ) : (
              suppliers.map((s) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground font-mono">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
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
              disabled={page === totalPages || loading}
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
