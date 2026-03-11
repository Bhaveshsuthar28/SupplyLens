import { cn } from "@/lib/utils";

const gradeColors = {
  A: 'bg-success text-success-foreground',
  B: 'bg-primary text-primary-foreground',
  C: 'bg-warning text-warning-foreground',
  D: 'bg-destructive text-destructive-foreground',
};

export function GradeBadge({ grade, size = 'md', className }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded font-mono font-bold",
        gradeColors[grade] || 'bg-muted text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {grade}
    </span>
  );
}
