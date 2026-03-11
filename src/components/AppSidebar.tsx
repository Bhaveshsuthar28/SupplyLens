import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Users, Settings } from "lucide-react";

const navItems = [
  { to: "/suppliers", label: "Vendor Performance Overview", icon: Users },
  { to: "/metrics", label: "Change Evaluation Metric", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

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
    </aside>
  );
}
