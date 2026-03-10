import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}

export function KPICard({ label, value, icon, className }: KPICardProps) {
  return (
    <div className={cn("border border-border bg-card p-5 shadow-crisp", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground font-sans">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="font-mono text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}
