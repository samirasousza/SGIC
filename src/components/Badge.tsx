import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | "orange";
  className: string;
}) {
  return (
    <span className={`badge badge-${tone} ${className}`}>
      <span className="badge-dot" />
      {children}
    </span>
  );
}
