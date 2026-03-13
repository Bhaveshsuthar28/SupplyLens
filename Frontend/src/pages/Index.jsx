import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth, useUser, SignIn, SignUp } from "@clerk/react";
import { useTheme } from "next-themes";
import {
  BarChart3, TrendingUp, Package, ShieldAlert, ClipboardCheck, Truck,
  Upload, ArrowRight, CheckCircle2, X, LogIn, Sun, Moon,
} from "lucide-react";
import heroImage from "@/assets/hero-illustration.svg";
import SignOutConfirm from "@/components/SignOutConfirm";

// ─── Clerk appearance — adapts to dark/light mode ─────────────────────────────
function clerkAppearance(isDark) {
  return {
    elements: {
      rootBox: "shadow-2xl rounded-2xl overflow-hidden",
      card: isDark ? "bg-card border border-border" : "bg-white border border-blue-100",
      headerTitle: isDark ? "text-foreground" : "text-gray-900",
      headerSubtitle: isDark ? "text-muted-foreground" : "text-gray-500",
      formFieldLabel: isDark ? "text-foreground" : "text-gray-700",
      formFieldInput: isDark
        ? "bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-200",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
      footerActionLink: "text-blue-600 hover:text-blue-700",
      identityPreviewText: isDark ? "text-foreground" : "text-gray-700",
      identityPreviewEditButton: "text-blue-600",
      socialButtonsBlockButton: isDark
        ? "border-border text-foreground hover:bg-muted"
        : "border-gray-200 text-gray-700 hover:bg-blue-50",
      dividerLine: isDark ? "bg-border" : "bg-gray-200",
      dividerText: isDark ? "text-muted-foreground" : "text-gray-400",
    },
  };
}

// ─── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ view, onClose, onSwitch, isDark }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-card rounded-full border border-border shadow-md flex items-center justify-center hover:bg-destructive/10 transition-colors group"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
        </button>

        {view === "sign-in" ? (
          <SignIn routing="hash" signUpUrl="/sign-up" appearance={clerkAppearance(isDark)} />
        ) : (
          <SignUp routing="hash" signInUrl="/sign-in" appearance={clerkAppearance(isDark)} />
        )}

        <div className="mt-0 text-center text-sm text-muted-foreground bg-card border-x border-b border-border rounded-b-xl py-2.5 px-4">
          {view === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => onSwitch("sign-up")} className="text-primary font-medium hover:underline">
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => onSwitch("sign-in")} className="text-primary font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Analytics Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Vendor Performance", path: "/suppliers", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Change Metric", path: "/metrics", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Profile", path: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Sign out", path: null, isSignOut: true, icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" },
];

// ─── Animated User Menu ────────────────────────────────────────────────────────
function UserMenu({ displayName, imageUrl, onSignOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const bg       = isDark ? "hsl(210,13%,13%)" : "white";
  const border   = isDark ? "hsl(210,11%,20%)" : "#bfdbfe";
  const text     = isDark ? "hsl(210,14%,90%)" : "#111827";
  const hoverBg  = isDark ? "hsl(210,13%,18%)" : "#eff6ff";
  const hoverRed = isDark ? "hsl(350,30%,20%)" : "#fef2f2";
  const shadow   = isDark ? "0 4px 20px rgba(0,0,0,0.35)" : "0 4px 20px rgba(37,99,235,0.08)";

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleItemClick = (item) => {
    setOpen(false);
    if (item.isSignOut) { onSignOut(); return; }
    if (item.path) navigate(item.path);
  };

  return (
    <div ref={ref} className="flex items-center justify-end" style={{ gap: 0 }}>
      {/* Slide-out items strip */}
      <div style={{
        maxWidth: open ? "820px" : "0px", overflow: "hidden", flexShrink: 0,
        transition: open
          ? "max-width 560ms cubic-bezier(0.22,1,0.36,1)"
          : "max-width 380ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "4px",
          background: bg, border: `1px solid ${border}`, borderRight: "none",
          borderRadius: "9999px 0 0 9999px", padding: "4px 6px 4px 10px",
          boxShadow: shadow, whiteSpace: "nowrap",
        }}>
          {NAV_ITEMS.map(({ label, icon, path, isSignOut }, i) => (
            <button key={label} onClick={() => handleItemClick({ label, path, isSignOut })}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                fontSize: "14px", fontWeight: "500", padding: "5px 11px",
                borderRadius: "9999px", cursor: "pointer", whiteSpace: "nowrap",
                color: isSignOut ? "#ef4444" : text,
                background: "transparent", border: "none",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0) scale(1)" : "translateX(14px) scale(0.95)",
                transition: open
                  ? `opacity 240ms ${60 + i * 70}ms ease-out, transform 300ms ${60 + i * 70}ms cubic-bezier(0.34,1.56,0.64,1), background-color 150ms`
                  : "opacity 80ms ease, transform 80ms ease",
                pointerEvents: open ? "auto" : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isSignOut ? hoverRed : hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none"
                stroke={isSignOut ? "#ef4444" : text} strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
            </button>
          ))}
          <div style={{
            width: "1px", height: "20px", background: border, flexShrink: 0, marginLeft: "2px",
            opacity: open ? 0.7 : 0,
            transition: open ? `opacity 180ms ${60 + NAV_ITEMS.length * 70}ms ease` : "opacity 60ms ease",
          }} />
        </div>
      </div>

      {/* Avatar pill */}
      <div style={{
        display: "flex", alignItems: "center", background: bg,
        border: `1px solid ${open ? border : (isDark ? "hsl(210,11%,22%)" : "#e5e7eb")}`,
        borderLeft: open ? `1px solid transparent` : `1px solid ${isDark ? "hsl(210,11%,22%)" : "#e5e7eb"}`,
        borderRadius: open ? "0 9999px 9999px 0" : "9999px",
        padding: "4px", flexShrink: 0,
        boxShadow: open ? shadow : (isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.08)"),
        transition: "border-radius 420ms cubic-bezier(0.22,1,0.36,1), border-color 300ms ease, box-shadow 300ms ease",
      }}>
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation"
          style={{
            width: 34, height: 34, borderRadius: "9999px",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", cursor: "pointer", flexShrink: 0,
            boxShadow: open ? "0 0 0 3px rgba(37,99,235,0.22)" : "none",
            transform: open ? "scale(1.06)" : "scale(1)",
            transition: "box-shadow 260ms ease, transform 320ms cubic-bezier(0.34,1.56,0.64,1)",
          }}>
          {imageUrl && (
            <img src={imageUrl} alt={displayName} referrerPolicy="no-referrer" style={{
              width: "100%", height: "100%", objectFit: "cover",
              borderRadius: "9999px", position: "absolute", inset: 0, zIndex: 1,
              opacity: open ? 0 : 1, transform: open ? "scale(0.8)" : "scale(1)",
              transition: "opacity 160ms ease, transform 210ms ease",
            }} />
          )}
          {!imageUrl && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{
              position: "absolute", opacity: open ? 0 : 1,
              transform: open ? "scale(0.35) rotate(80deg)" : "scale(1) rotate(0deg)",
              transition: "opacity 160ms ease, transform 210ms ease",
            }}>
              <circle cx="12" cy="8" r="4" fill="white" />
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          )}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{
            position: "absolute", opacity: open ? 1 : 0,
            transform: open ? "scale(1) rotate(0deg)" : "scale(0.35) rotate(-80deg)",
            transition: "opacity 160ms 90ms ease, transform 210ms 90ms ease",
          }}>
            <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
        </button>

        <span style={{
          fontSize: "14px", fontWeight: "600", color: text,
          whiteSpace: "nowrap", overflow: "hidden",
          maxWidth: open ? "0px" : "160px",
          opacity: open ? 0 : 1,
          paddingLeft: open ? 0 : "7px",
          paddingRight: open ? 0 : "5px",
          transition: open
            ? "max-width 210ms ease-in, opacity 160ms ease-in, padding 210ms ease-in"
            : "max-width 300ms 90ms cubic-bezier(0.22,1,0.36,1), opacity 220ms 80ms ease-out, padding 300ms 90ms ease-out",
        }}>
          {displayName}
        </span>
      </div>
    </div>
  );
}

// ─── Theme toggle button ───────────────────────────────────────────────────────
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors shrink-0"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ─── Page data ─────────────────────────────────────────────────────────────────
const features = [
  { icon: ClipboardCheck, title: "Supplier Scorecards", desc: "Automated vendor evaluation reports with composite reliability scoring.", path: "/suppliers" },
  { icon: Truck, title: "Delivery Performance Analytics", desc: "Monitor on-time delivery trends across your entire supplier base.", path: "/dashboard" },
  { icon: Package, title: "Fill Rate Analysis", desc: "Track supplier fulfillment accuracy against ordered quantities.", path: "/dashboard" },
  { icon: ShieldAlert, title: "Quality Rejection Monitoring", desc: "Identify suppliers causing production defects and quality issues.", path: "/suppliers" },
  { icon: TrendingUp, title: "Procurement Risk Alerts", desc: "Detect supplier performance degradation before it impacts production.", path: "/dashboard" },
  { icon: BarChart3, title: "Composite Scoring", desc: "Weighted scoring combining delivery, fill rate, and quality metrics.", path: "/metrics" },
];

const workflow = [
  { step: "01", title: "Upload Data", desc: "Import CSV or Excel procurement data — POs, GRNs, delivery records." },
  { step: "02", title: "Analyze", desc: "System calculates OTD, fill rate, rejection rate, and composite scores." },
  { step: "03", title: "Evaluate", desc: "Suppliers are graded A through D based on weighted performance metrics." },
  { step: "04", title: "Act", desc: "Receive actionable recommendations to optimize your supply chain." },
];

const stats = [
  { value: "500+", label: "Procurement Teams" },
  { value: "2M+", label: "POs Analyzed" },
  { value: "99.1%", label: "Avg. Data Accuracy" },
  { value: "<5 min", label: "Setup Time" },
];

const trustBadges = [
  "No credit card required",
  "SOC 2 compliant",
  "Works with any ERP",
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Index() {
  useDocumentTitle();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [authView, setAuthView] = useState(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (isSignedIn && authView) setAuthView(null);
  }, [isSignedIn, authView]);

  const displayName = user
    ? (user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "User")
    : "";
  const imageUrl = user?.imageUrl || null;

  const handleProtectedNav = (path) => {
    if (isSignedIn) navigate(path);
    else setAuthView("sign-in");
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-background">

      {authView && (
        <AuthModal
          view={authView}
          onClose={() => setAuthView(null)}
          onSwitch={(v) => setAuthView(v)}
          isDark={isDark}
        />
      )}

      <SignOutConfirm
        open={showSignOutConfirm}
        displayName={displayName}
        onConfirm={() => { signOut(); setShowSignOutConfirm(false); }}
        onCancel={() => setShowSignOutConfirm(false)}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-blue-50/90 dark:bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="font-sans font-bold text-lg text-foreground">SupplyLens</span>
          </button>

          {/* Right side: user controls + theme toggle */}
          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : isSignedIn ? (
              <UserMenu displayName={displayName} imageUrl={imageUrl} onSignOut={() => setShowSignOutConfirm(true)} />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthView("sign-in")}
                  className="inline-flex items-center gap-1.5 h-9 px-4 border border-blue-200 dark:border-border text-blue-700 dark:text-foreground text-sm font-medium rounded-lg bg-white dark:bg-card hover:bg-blue-50 dark:hover:bg-muted transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => setAuthView("sign-up")}
                  className="inline-flex items-center gap-1.5 h-9 px-5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section>
        <div className="container py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Procurement Analytics Platform
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              <span className="text-foreground">Supply</span><span className="text-primary">Lens</span>
            </h1>
            <p className="text-lg font-sans font-semibold text-primary mb-4">
              Supplier Performance Intelligence Platform
            </p>
            <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Transform procurement decisions with data-driven supplier analytics. Monitor supplier reliability, delivery performance, fill rates, and quality trends using procurement data.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => handleProtectedNav("/upload")}
                className="inline-flex items-center gap-2 justify-center h-11 px-6 bg-primary text-primary-foreground text-sm font-sans font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                <Upload className="w-4 h-4" />
                Upload Procurement Data
              </button>
              <button
                onClick={() => handleProtectedNav("/dashboard")}
                className="inline-flex items-center gap-2 justify-center h-11 px-6 border border-primary/30 text-primary text-sm font-sans font-semibold rounded-lg bg-white dark:bg-card hover:bg-primary/5 transition-colors"
              >
                Explore Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {trustBadges.map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img src={heroImage} alt="Supplier analytics illustration" className="w-full max-w-lg drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="container py-20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Key Features</h2>
          <p className="text-muted-foreground mb-12">Core capabilities powering your procurement intelligence.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <button
                key={f.title}
                onClick={() => handleProtectedNav(f.path)}
                className="bg-white/70 dark:bg-card/80 rounded-xl p-8 shadow-sm text-left hover:shadow-md hover:bg-white dark:hover:bg-card transition-all group border border-transparent hover:border-blue-100 dark:hover:border-border cursor-pointer"
              >
                <f.icon className="w-5 h-5 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-sans font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                {isLoaded && !isSignedIn && (
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-blue-500 font-medium">
                    <LogIn className="w-3 h-3" /> Sign in to access
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section>
        <div className="container py-20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Platform Workflow</h2>
          <p className="text-muted-foreground mb-12">From raw data to actionable procurement insights in four steps.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {workflow.map((w) => (
              <div key={w.step} className="bg-white/70 dark:bg-card/80 rounded-xl p-6 shadow-sm border border-transparent dark:border-border/50">
                <span className="font-mono text-3xl font-bold text-primary mb-3 block">{w.step}</span>
                <h3 className="font-sans font-semibold text-foreground mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary-foreground">{s.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — only shown when not signed in */}
      {isLoaded && !isSignedIn && (
        <section className="bg-white dark:bg-card border-t border-blue-100 dark:border-border">
          <div className="container py-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join procurement teams already using SupplyLens to optimize supplier performance.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => setAuthView("sign-up")}
                className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAuthView("sign-in")}
                className="inline-flex items-center gap-2 h-11 px-5 border border-blue-200 dark:border-border text-blue-700 dark:text-foreground text-sm font-semibold rounded-lg bg-white dark:bg-muted hover:bg-blue-50 dark:hover:bg-muted/80 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-blue-100 dark:border-border">
        <div className="container py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="font-sans">SupplyLens</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">Supplier Performance Intelligence</p>
        </div>
      </footer>

    </div>
  );
}
