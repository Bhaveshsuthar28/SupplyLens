import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import "./index.css";

// Fire-and-forget: wake up the Render backend immediately so it's already
// warm by the time the user finishes authenticating (~30-60 s cold start).
fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/health`)
  .catch(() => {});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
