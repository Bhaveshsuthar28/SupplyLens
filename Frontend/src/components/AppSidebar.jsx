import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Users, Settings, LayoutDashboard, Upload, LogOut } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import SignOutConfirm from "@/components/SignOutConfirm";

const navItems = [
  { to: "/dashboard", label: "Analytics Dashboard", icon: LayoutDashboard },
  { to: "/suppliers", label: "Vendor Performance Overview", icon: Users },
  { to: "/upload", label: "Data Ingestion", icon: Upload },
  { to: "/metrics", label: "Change Evaluation Metric", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <Link to="/" className="flex items-center gap-2 px-5 py-6 border-b border-sidebar-border">
        <BarChart3 className="w-6 h-6 text-sidebar-primary" />
        <span className="font-sans font-bold text-lg text-sidebar-foreground">SupplyLens</span>
      </Link>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-5 py-3 text-sm font-sans transition-colors relative",
                isActive
                  ? "text-sidebar-primary-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-sidebar-primary rounded-r" />
              )}
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-sidebar-border px-5 py-4">
        {user?.email && (
          <p className="text-xs text-sidebar-foreground/60 font-mono truncate mb-3">{user.email}</p>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 w-full text-sm font-sans text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent px-2 py-2 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <SignOutConfirm
        open={showConfirm}
        displayName={user?.email}
        onConfirm={() => { logout(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </aside>
  );
}
