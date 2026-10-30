interface ProjectDataFieldProps {
  label: string;
  value: string;
  className?: string;
}

export function ProjectDataField({
  label,
  value,
  className = "",
}: ProjectDataFieldProps) {
  return (
    <div className={className}>
      <span className="mb-1 block text-xs text-slate-500">{label}</span>

      <strong className="block break-words text-sm font-medium text-slate-800">
        {value || "Não informado"}
      </strong>
    </div>
  );
}
