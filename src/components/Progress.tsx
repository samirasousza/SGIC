export function Progress({
  value,
  tone = "blue",
}: {
  value: number;
  tone?: "blue" | "green" | "orange";
}) {
  const colors = {
    blue: "bg-indigo-600",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
  };

  const progress = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${progress}% concluído`}
    >
      <span
        className={`block h-full rounded-full transition-all duration-300 ${colors[tone]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
