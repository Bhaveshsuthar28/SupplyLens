import { useState, useRef } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CATEGORIES, GRADES } from "@/lib/supplierData";
import { GradeBadge } from "@/components/GradeBadge";
import { TrendIndicator } from "@/components/TrendIndicator";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { api } from "@/lib/apiClient";
import { normalizeSupplierList } from "@/lib/normalizers";
import { queryKeys } from "@/lib/queryKeys";

const PAGE_SIZE = 15;

export default function Suppliers() {
  useDocumentTitle("Vendor Performance");
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("All Categories");
  const [grade, setGrade] = useState("All Grades");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false);
  const [removingAll, setRemovingAll] = useState(false);
  const confirmTimer = useRef(null);

  const invalidate = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.metrics.all() }),
  ]);

  const handleRemove = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirmId(null), 3000);
      return;
    }
    setConfirmId(null);
    setRemovingId(id);
    try {
      await api.delete(`/api/v1/suppliers/${id}`);
      await invalidate();
      if (suppliers.length === 1 && page > 1) setPage((p) => p - 1);
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveAll = async () => {
    if (!confirmRemoveAll) { setConfirmRemoveAll(true); return; }
    setConfirmRemoveAll(false);
    setRemovingAll(true);
    try {
      await api.delete("/api/v1/suppliers/");
      await invalidate();
      setPage(1);
    } finally {
      setRemovingAll(false);
    }
  };

  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: queryKeys.suppliers.list({ category, grade, search, page }),
    queryFn: async () => {
      const params = new URLSearchParams({ page, page_size: PAGE_SIZE });
      if (category !== "All Categories") params.set("category", category);
      if (grade !== "All Grades") params.set("grade", grade);
      if (search.trim()) params.set("search", search.trim());
      return api.get(`/api/v1/suppliers/?${params}`);
    },
    placeholderData: keepPreviousData,
  });

  const suppliers = normalizeSupplierList(data?.data ?? []);
  const total     = data?.total ?? 0;
  const error     = queryError?.message ?? null;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleCategory = (v) => { setCategory(v); setPage(1); };
  const handleGrade = (v) => { setGrade(v); setPage(1); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-wrap items-start justify-between mb-1 gap-2">
        <h1 className="text-2xl font-bold text-foreground">Vendor Performance Overview</h1>
        <div className="flex items-center gap-2">
          {confirmRemoveAll && (
            <button onClick={() => setConfirmRemoveAll(false)}
              className="h-8 px-3 border border-border rounded text-xs font-sans text-muted-foreground hover:bg-card transition-colors">
              Cancel
            </button>
          )}
          <button
            onClick={handleRemoveAll}
            disabled={removingAll || total === 0}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-sans font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              confirmRemoveAll
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "border border-destructive/50 text-destructive hover:bg-destructive/10"
            }`}
          >
            <Trash2 className="w-3 h-3" />
            {removingAll ? "Removing…" : confirmRemoveAll ? "Confirm Remove All" : "Remove All"}
          </button>
        </div>
      </div>
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
      <div className="border border-border shadow-crisp overflow-x-auto rounded-lg">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">ID</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">Supplier Name</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">OTD %</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Fill Rate %</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">Reject %</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Trend (Last 30D)</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider">Score</th>
              <th className="text-left px-4 py-3 font-sans font-medium text-muted-foreground text-xs uppercase tracking-wider"></th>
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
                  <td className="px-4 py-3 font-mono text-muted-foreground hidden sm:table-cell">{s.id}</td>
                  <td className="px-4 py-3 font-sans font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 font-sans text-muted-foreground hidden md:table-cell">{s.category}</td>
                  <td className="px-4 py-3 font-mono">{s.otd}%</td>
                  <td className="px-4 py-3 font-mono hidden sm:table-cell">{s.fillRate}%</td>
                  <td className="px-4 py-3 font-mono">{s.rejectRate}%</td>
                  <td className="px-4 py-3 hidden md:table-cell"><TrendIndicator trend={s.trend} /></td>
                  <td className="px-4 py-3"><GradeBadge grade={s.grade} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/suppliers/${s.id}`}
                        className="inline-flex items-center justify-center h-7 px-3 bg-primary text-primary-foreground text-xs font-sans font-medium rounded hover:opacity-90 transition-opacity">
                        View
                      </Link>
                      <button
                        onClick={() => handleRemove(s.id)}
                        disabled={removingId === s.id}
                        className={`inline-flex items-center justify-center h-7 px-3 text-xs font-sans font-medium rounded transition-colors disabled:opacity-50 ${
                          confirmId === s.id
                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            : "border border-destructive/40 text-destructive hover:bg-destructive/10"
                        }`}
                      >
                        {removingId === s.id ? "…" : confirmId === s.id ? "Confirm?" : "Remove"}
                      </button>
                    </div>
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
