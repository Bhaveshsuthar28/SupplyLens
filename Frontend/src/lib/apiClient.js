/**
 * src/lib/apiClient.js
 *
 * Thin fetch wrapper that:
 *  1. Attaches the Bearer access token to every request
 *  2. On 401 → tries to refresh the token once, then retries
 *  3. On second 401 → clears auth and throws
 */

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// These are injected by ProtectedRoute before any API call is made
let _getToken = () => null;
let _refresh = async () => null;
let _clearAuth = () => {};

export function injectAuthHandlers({ getToken, refresh, clearAuth }) {
  _getToken = getToken;
  _refresh = refresh;
  _clearAuth = clearAuth;
}

async function request(path, options = {}, retry = true) {
  const token = _getToken();

  const headers = {
    ...(options._multipart ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && retry) {
    // Try refreshing the token once
    const newToken = await _refresh();
    if (newToken) {
      return request(path, options, false);   // retry with new token
    }
    _clearAuth();
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

// ── Convenience methods ───────────────────────────────────────────────────────
export const api = {
  get:    (path, opts) => request(path, { ...opts, method: "GET" }),
  post:   (path, body, opts) => request(path, { ...opts, method: "POST",  body: JSON.stringify(body) }),
  put:    (path, body, opts) => request(path, { ...opts, method: "PUT",   body: JSON.stringify(body) }),
  delete: (path, opts)       => request(path, { ...opts, method: "DELETE" }),
  upload: (path, formData)   => request(path, { method: "POST", body: formData, _multipart: true }),
};

export default api;
