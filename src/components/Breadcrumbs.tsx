import { Icon } from "./Icon";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; onClick?: () => void }[];
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
      aria-label="Navegação estrutural"
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className="inline-flex items-center gap-2"
        >
          {index > 0 && (
            <Icon name="arrow" size={13} />
          )}

          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="cursor-pointer transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 rounded-sm"
            >
              {item.label}
            </button>
          ) : (
            <strong className="font-medium text-slate-800">
              {item.label}
            </strong>
          )}
        </span>
      ))}
    </nav>
  );
}