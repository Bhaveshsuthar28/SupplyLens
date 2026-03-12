/**
 * src/context/AuthContext.jsx
 *
 * Stores our own access token (in memory) and handles:
 *  - exchanging a Clerk token for backend tokens (on first sign-in)
 *  - silently refreshing the access token (on 401)
 *  - logout (revokes refresh token + Clerk sign-out)
 */

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { getToken, signOut: clerkSignOut } = useClerkAuth();

  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem("sl_access_token") || null
  );
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("sl_user");
    return raw ? JSON.parse(raw) : null;
  });

  // isReady: true once we have a token OR exchange has been attempted.
  // Starts true if there's already a token in sessionStorage (returning session).
  const [isReady, setIsReady] = useState(
    () => !!sessionStorage.getItem("sl_access_token")
  );

  const refreshingRef = useRef(false);
  const exchangingRef = useRef(false); // prevents concurrent/duplicate exchange calls

  // ── Save token helpers ───────────────────────────────────────────────────
  const saveToken = (token, userInfo) => {
    setAccessToken(token);
    sessionStorage.setItem("sl_access_token", token);
    if (userInfo) {
      setUser(userInfo);
      sessionStorage.setItem("sl_user", JSON.stringify(userInfo));
    }
  };

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setIsReady(false);
    sessionStorage.removeItem("sl_access_token");
    sessionStorage.removeItem("sl_user");
  }, []);

  // ── Exchange Clerk token for backend tokens ──────────────────────────────
  const exchange = useCallback(async () => {
    if (exchangingRef.current) return; // already in-flight, skip
    exchangingRef.current = true;
    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("No Clerk session token");

      const res = await fetch(`${API}/auth/exchange`, {
        method: "POST",
        credentials: "include", // receive httpOnly refresh cookie
        headers: { Authorization: `Bearer ${clerkToken}` },
        signal: AbortSignal.timeout(45_000), // fail after 45 s, never hang forever
      });

      if (!res.ok) throw new Error(`Exchange failed: ${res.status}`);

      const data = await res.json();
      saveToken(data.access_token, { user_id: data.user_id, email: data.email });
    } finally {
      exchangingRef.current = false;
      setIsReady(true); // mark ready regardless — error is surfaced via thrown error
    }
  }, [getToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh access token using the httpOnly cookie ───────────────────────
  const refresh = useCallback(async () => {
    if (refreshingRef.current) return null;
    refreshingRef.current = true;
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        signal: AbortSignal.timeout(20_000), // fail after 20 s
      });
      if (!res.ok) {
        clearAuth();
        return null;
      }
      const data = await res.json();
      saveToken(data.access_token, null);
      return data.access_token;
    } finally {
      refreshingRef.current = false;
    }
  }, [clearAuth]);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    clearAuth();
    await clerkSignOut();
  }, [clerkSignOut, clearAuth]);

  return (
    <AuthContext.Provider value={{ accessToken, user, isReady, exchange, refresh, logout, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
