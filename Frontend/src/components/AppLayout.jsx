import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { UploadProvider } from "@/context/UploadContext";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@clerk/react";
import SignOutConfirm from "@/components/SignOutConfirm";

const PAGE_TITLES = {
  "/dashboard": "Analytics Dashboard",
  "/suppliers": "Vendor Performance",
  "/upload":    "Data Ingestion",
  "/metrics":   "Evaluation Metrics",
  "/profile":   "Profile",
};

function MobileTopBar({ onMenuClick }) {
  const location = useLocation();
  const title = Object.entries(PAGE_TITLES).find(([p]) =>
    location.pathname.startsWith(p)
  )?.[1] ?? "SupplyLens";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-3 z-40 gap-3">
      <button
        onClick={onMenuClick}
        className="p-2 rounded hover:bg-sidebar-accent transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-sidebar-foreground" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-sidebar-foreground/50 leading-none">SupplyLens</p>
        <p className="text-sm font-sans font-semibold text-sidebar-foreground truncate leading-tight mt-0.5">{title}</p>
      </div>
    </div>
  );
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user: authUser, logout } = useAuthContext();
  const { user: clerkUser } = useUser();

  const email = clerkUser?.primaryEmailAddress?.emailAddress || authUser?.email || "";

  return (
    <UploadProvider>
      <div className="min-h-screen bg-background">
        <MobileTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AppSidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
        />

        <main className="md:ml-60 pt-14 md:pt-0">
          <Outlet />
        </main>

        {/* Sign out confirmation modal - rendered outside sidebar */}
        <SignOutConfirm
          open={showConfirm}
          displayName={email}
          onConfirm={() => { logout(); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </UploadProvider>
  );
}
