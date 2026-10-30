import { Badge } from "./Badge";
import { Icon } from "./Icon";

export function EvaluatorPerson({
  index,
  name,
  status,
}: {
  index: string;
  name: string;
  status: string;
}) {
  const statusConfig = {
    Pendente: {
      tone: "danger",
      icon: "clock",
    },
    Sugerido: {
      tone: "warning",
      icon: "clock",
    },
    Definido: {
      tone: "success",
      icon: "check",
    },
  } as const;

  const config = statusConfig[status as keyof typeof statusConfig] ?? {
    tone: "neutral",
    icon: "info",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
        {index}
      </span>

      <div className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-medium text-slate-800">
          {name}
        </strong>
        <small className="mt-0.5 block text-xs text-slate-500">
          Membro avaliador
        </small>
      </div>

      <Badge tone={config.tone}>
        <Icon name={config.icon} size={12} />
        {status}
      </Badge>
    </div>
  );
}
