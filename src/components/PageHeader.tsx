import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        {eyebrow && (
          <span className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-1 text-3xl font-bold text-gray-900">{title}</h1>

        <p className="mt-2 max-w-2xl text-gray-600">{description}</p>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}