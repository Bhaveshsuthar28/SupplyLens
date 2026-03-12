import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";
import { cn } from "@/lib/utils";
import {
  BarChart3, Users, Settings, LayoutDashboard,
  Upload, LogOut, ChevronRight, X,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useUploadContext } from "@/context/UploadContext";
import SignOutConfirm from "@/components/SignOutConfirm";

const navItems = [
  { to: "/dashboard",  label: "Analytics Dashboard",    icon: LayoutDashboard },
  { to: "/suppliers",  label: "Vendor Performance",     icon: Users },
  { to: "/upload",     label: "Data Ingestion",         icon: Upload },
  { to: "/metrics",    label: "Evaluation Metrics",     icon: Settings },
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

export function AppSidebar({ open, onClose }) {
  const location = useLocation();
  const { user: authUser, logout } = useAuthContext();
  const { user: clerkUser } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const { uploading, file } = useUploadContext();

  const displayName = clerkUser?.fullName || clerkUser?.firstName || authUser?.email?.split("@")[0] || "User";
  const email = clerkUser?.primaryEmailAddress?.emailAddress || authUser?.email || "";
  const imageUrl = clerkUser?.imageUrl || null;

  return (
    <aside className={cn(
      "fixed left-0 top-0 bottom-0 w-60 bg-sidebar text-sidebar-foreground flex flex-col z-50 transition-transform duration-200",
      "md:translate-x-0",
      open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
    )}>
      {/* Logo + mobile close button */}
      <div className="flex items-center border-b border-sidebar-border">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-6 flex-1"
        >
          <BarChart3 className="w-6 h-6 text-sidebar-primary" />
          <span className="font-sans font-bold text-lg text-sidebar-foreground">SupplyLens</span>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-2 mr-2 rounded hover:bg-sidebar-accent transition-colors"
        >
          <X className="w-4 h-4 text-sidebar-foreground/60" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 text-sm font-sans transition-colors relative select-none",
                isActive
                  ? "text-sidebar-primary-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-sidebar-primary rounded-r" />
              )}
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upload progress indicator */}
      {uploading && (
        <div className="mx-3 mb-2 px-3 py-2.5 rounded border border-sidebar-border bg-sidebar-accent/40">
          <div className="flex items-center gap-2">
            <svg className="animate-spin w-3.5 h-3.5 text-sidebar-primary shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div className="min-w-0">
              <p className="text-xs font-sans font-semibold text-sidebar-foreground leading-tight">Processing upload…</p>
              {file && (
                <p className="text-xs font-mono text-sidebar-foreground/50 truncate leading-tight mt-0.5">{file.name}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile section */}
      <div className="border-t border-sidebar-border">
        <Link
          to="/profile"
          onClick={onClose}
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
