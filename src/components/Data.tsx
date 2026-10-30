
export function Data({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <strong className="text-sm font-semibold text-slate-800">
        {value}
      </strong>
    </div>
  );
}
