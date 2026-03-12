import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import "./index.css";

// Fire-and-forget: wake up the Render backend AND warm the DB connection
// immediately so both are ready by the time the user finishes authenticating.
const _api = import.meta.env.VITE_API_URL || "http://localhost:8000";
fetch(`${_api}/health/db`, { signal: AbortSignal.timeout(60_000) }).catch(() => {});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
