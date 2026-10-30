import type { ReactNode } from "react";

const badgeStyles = {
  success: {
    container: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    container: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  danger: {
    container: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  orange: {
    container: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  info: {
    container: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  neutral: {
    container: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeStyles;
  className?: string;
}) {
  const styles = badgeStyles[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${styles.container} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {children}
    </span>
  );
}
