
export function ScoreField({ label }: { label: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <select
        defaultValue=""
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="" disabled>
          Nota de 0 a 10
        </option>

        {Array.from({ length: 11 }, (_, index) => (
          <option key={index} value={index}>
            {index}
          </option>
        ))}
      </select>
    </label>
  );
}