import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";
import { cn } from "@/lib/utils";
import {
  BarChart3, Users, Settings, LayoutDashboard,
  Upload, LogOut, ChevronRight,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import SignOutConfirm from "@/components/SignOutConfirm";

const navItems = [
  { to: "/dashboard",  label: "Analytics Dashboard",         icon: LayoutDashboard },
  { to: "/suppliers",  label: "Vendor Performance Overview", icon: Users },
  { to: "/upload",     label: "Data Ingestion",              icon: Upload },
  { to: "/metrics",    label: "Change Evaluation Metric",    icon: Settings },
];

function SidebarAvatar({ imageUrl, name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-8 h-8 rounded-full object-cover shrink-0"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center shrink-0 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { user: authUser, logout } = useAuthContext();
  const { user: clerkUser } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  const displayName = clerkUser?.fullName || clerkUser?.firstName || authUser?.email?.split("@")[0] || "User";
  const email = clerkUser?.primaryEmailAddress?.emailAddress || authUser?.email || "";
  const imageUrl = clerkUser?.imageUrl || null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-5 py-6 border-b border-sidebar-border">
        <BarChart3 className="w-6 h-6 text-sidebar-primary" />
        <span className="font-sans font-bold text-lg text-sidebar-foreground">SupplyLens</span>
      </Link>

      {/* Nav items */}
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

      {/* Profile section */}
      <div className="border-t border-sidebar-border">
        {/* Profile nav link */}
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-3 px-4 py-3 transition-colors group relative",
            location.pathname === "/profile"
              ? "bg-sidebar-accent"
              : "hover:bg-sidebar-accent"
          )}
        >
          {location.pathname === "/profile" && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-sidebar-primary rounded-r" />
          )}
          <SidebarAvatar imageUrl={imageUrl} name={displayName} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium text-sidebar-foreground truncate leading-tight">
              {displayName}
            </p>
            <p className="text-xs font-mono text-sidebar-foreground/50 truncate leading-tight mt-0.5">
              {email}
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground/40 shrink-0 group-hover:text-sidebar-foreground/70 transition-colors" />
        </Link>

        {/* Sign out */}
        <div className="px-4 pb-4 pt-1">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 w-full text-sm font-sans text-sidebar-foreground/60 hover:text-destructive hover:bg-sidebar-accent px-2 py-1.5 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <SignOutConfirm
        open={showConfirm}
        displayName={email}
        onConfirm={() => { logout(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </aside>
  );
}
