import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";

const UploadContext = createContext(null);

const POLL_MS = 2000; // poll every 2 seconds

export function UploadProvider({ children }) {
  const queryClient = useQueryClient();

  const [file, setFile]         = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [jobId, setJobId]       = useState(null);
  const [weekDate, setWeekDate] = useState(() => new Date().toISOString().slice(0, 10));

  const pollRef = useRef(null);

  // ── Stop polling ────────────────────────────────────────────────────────
  const stopPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // ── Poll for job result ──────────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;

    const check = async () => {
      if (cancelled) return;
      try {
        const data = await api.get(`/api/v1/upload/status/${jobId}`);
        if (cancelled) return;

        if (data.status === "done") {
          stopPoll();
          setResult(data.result);
          setJobId(null);
          setUploading(false);
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.metrics.all() }),
          ]);
        } else if (data.status === "failed") {
          stopPoll();
          setError(data.error || "Processing failed");
          setJobId(null);
          setUploading(false);
        }
        // "processing" → keep polling
      } catch (err) {
        if (cancelled) return;
        stopPoll();
        setError(err.message || "Failed to check job status");
        setJobId(null);
        setUploading(false);
      }
    };

    check(); // immediate first check
    pollRef.current = setInterval(check, POLL_MS);

    return () => {
      cancelled = true;
      stopPoll();
    };
  }, [jobId, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => stopPoll(), []);

  // ── Public API ──────────────────────────────────────────────────────────
  const selectFile = (f) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const reset = () => {
    stopPoll();
    setFile(null);
    setResult(null);
    setError(null);
    setUploading(false);
    setJobId(null);
  };

  const startUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("week_date", weekDate);
      const data = await api.upload("/api/v1/upload/", formData);
      // API returns {job_id, status: "processing"} immediately
      setJobId(data.job_id);
      // uploading stays true — polling will clear it when the job finishes
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <UploadContext.Provider value={{ file, uploading, jobId, result, error, weekDate, setWeekDate, selectFile, startUpload, reset }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploadContext() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUploadContext must be used inside UploadProvider");
  return ctx;
}
