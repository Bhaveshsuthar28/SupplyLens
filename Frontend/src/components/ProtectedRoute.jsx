/**
 * src/components/ProtectedRoute.jsx
 *
 * Wraps any route that requires authentication.
 *
 * Flow:
 *  1. Clerk not loaded yet  → full-screen spinner (one-time, ~200ms at app start)
 *  2. Clerk not signed in   → redirect to /sign-in
 *  3. Signed in, no token   → trigger exchange once (silent, renders null briefly)
 *  4. Has backend token     → render children — NO spinner on page navigation
 */

import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { injectAuthHandlers, api } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import { normalizeSupplierList } from "@/lib/normalizers";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { accessToken, isReady, exchange, refresh, clearAuth } = useAuthContext();
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Ref prevents double-triggering exchange when dependencies are recreated
  const exchangeStarted = useRef(false);
  // Ref prevents double-firing the prefetch across re-renders
  const prefetchDone = useRef(false);

  // Inject auth handlers once — stable because accessToken update triggers re-inject
  useEffect(() => {
    injectAuthHandlers({ getToken: () => accessToken, refresh, clearAuth });
  }, [accessToken, refresh, clearAuth]);

  // Silently prefetch common data right after auth so Dashboard and Metrics
  // pages render instantly from cache instead of showing a spinner.
  useEffect(() => {
    if (!isReady || !accessToken || prefetchDone.current) return;
    prefetchDone.current = true;
    queryClient.prefetchQuery({
      queryKey: queryKeys.suppliers.all(),
      queryFn:  () =>
        api.get("/api/v1/suppliers/?page=1&page_size=500")
          .then((r) => normalizeSupplierList(r.data)),
    });
    queryClient.prefetchQuery({
      queryKey: queryKeys.metrics.summary(),
      queryFn:  () => api.get("/api/v1/metrics/summary"),
    });
  }, [isReady, accessToken, queryClient]);

  // Trigger exchange exactly once per session when Clerk is ready but no backend token
  useEffect(() => {
    if (!isLoaded || !isSignedIn || accessToken || exchangeStarted.current) return;
    exchangeStarted.current = true;
    exchange().catch((err) => {
      exchangeStarted.current = false; // allow retry
      setError(err.message);
    });
  }, [isLoaded, isSignedIn, accessToken, exchange]);

  // 1. Clerk SDK initializing — only happens once at app start
  if (!isLoaded) return <LoadingScreen />;

  // 2. Not signed in
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  // 3. Exchange error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => { setError(null); exchangeStarted.current = false; }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // 4. Signed in but exchange still in flight — show spinner until token arrives
  if (!isReady || !accessToken) return <LoadingScreen />;

  // 5. Authenticated — render immediately, no spinner
  return children;
}
