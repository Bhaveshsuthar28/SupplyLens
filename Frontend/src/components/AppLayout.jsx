import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { UploadProvider } from "@/context/UploadContext";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UploadProvider>
      <div className="min-h-screen bg-background">
        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-4 z-40 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded hover:bg-sidebar-accent transition-colors"
          >
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <span className="font-sans font-bold text-sidebar-foreground">SupplyLens</span>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="md:ml-60 pt-14 md:pt-0">
          <Outlet />
        </main>
      </div>
    </UploadProvider>
  );
}
