interface ScoreFieldProps {
  label: string;
  value: number | null;
  allowedValues: number[];
  disabled?: boolean;
  notApplicable?: boolean;
  onChange: (value: number | null) => void;
  onNotApplicableChange?: (value: boolean) => void;
}

const selectClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export function ScoreField({
  label,
  value,
  allowedValues,
  disabled = false,
  notApplicable = false,
  onChange,
  onNotApplicableChange,
}: ScoreFieldProps) {
  const discrete = allowedValues.length > 0;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      {discrete ? (
        <select
          value={value === null ? "" : String(value)}
          disabled={disabled || notApplicable}
          onChange={(event) =>
            onChange(event.target.value === "" ? null : Number(event.target.value))
          }
          className={selectClass}
        >
          <option value="">Selecione</option>
          {allowedValues.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          min={0}
          max={10}
          step={0.01}
          value={value ?? ""}
          disabled={disabled || notApplicable}
          onChange={(event) =>
            onChange(event.target.value === "" ? null : Number(event.target.value))
          }
          placeholder="Nota de 0 a 10"
          className={selectClass}
        />
      )}

      {onNotApplicableChange && (
        <span className="flex items-center gap-2 text-xs font-normal text-slate-500">
          <input
            type="checkbox"
            checked={notApplicable}
            disabled={disabled}
            onChange={(event) => onNotApplicableChange(event.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Não se aplica (X)
        </span>
      )}
    </label>
  );
}
