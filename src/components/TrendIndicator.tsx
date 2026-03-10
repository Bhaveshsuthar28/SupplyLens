import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  trend: string;
  className?: string;
}

const trendConfig: Record<string, { color: string; dot: string; label: string }> = {
  Stable: { color: 'text-success', dot: 'bg-success', label: 'Stable' },
  Improving: { color: 'text-success', dot: 'bg-success', label: 'Improving' },
  Degrading: { color: 'text-destructive', dot: 'bg-destructive', label: 'Degrading' },
  Erratic: { color: 'text-warning', dot: 'bg-warning', label: 'Erratic' },
};

export function TrendIndicator({ trend, className }: TrendIndicatorProps) {
  const config = trendConfig[trend] || trendConfig.Stable;

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-sm", config.color, className)}>
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
