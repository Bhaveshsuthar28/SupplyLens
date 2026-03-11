/**
 * src/components/ProtectedRoute.jsx
 *
 * Wraps any route that requires authentication.
 *
 * Flow:
 *  1. Clerk not loaded yet → show spinner
 *  2. Clerk not signed in → redirect to /sign-in
 *  3. Clerk signed in but no backend access token → exchange (once)
 *  4. Has backend access token → render children + inject auth into apiClient
 */

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useAuthContext } from "@/context/AuthContext";
import { injectAuthHandlers } from "@/lib/apiClient";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { accessToken, exchange, refresh, clearAuth } = useAuthContext();
  const [exchanging, setExchanging] = useState(false);
  const [error, setError] = useState(null);

  // Inject auth handlers into the API client so it can refresh tokens
  useEffect(() => {
    injectAuthHandlers({
      getToken: () => accessToken,
      refresh,
      clearAuth,
    });
  }, [accessToken, refresh, clearAuth]);

  // Exchange Clerk token for backend tokens when clerk is signed in but we don't have a backend token yet
  useEffect(() => {
    if (isLoaded && isSignedIn && !accessToken && !exchanging) {
      setExchanging(true);
      exchange()
        .catch((err) => setError(err.message))
        .finally(() => setExchanging(false));
    }
  }, [isLoaded, isSignedIn, accessToken, exchange, exchanging]);

  // 1. Clerk still loading
  if (!isLoaded || exchanging) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Authenticating…</p>
        </div>
      </div>
    );
  }

  // 2. Not signed in → redirect
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // 3. Exchange error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => { setError(null); setExchanging(false); }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // 4. Has backend token → render
  if (accessToken) {
    return children;
  }

  // still waiting for exchange to produce a token
  return null;
}
