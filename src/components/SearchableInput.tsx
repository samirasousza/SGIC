import { useId } from "react";
import { Icon } from "./Icon";

interface SearchableInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function SearchableInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Buscar por nome ou e-mail",
}: SearchableInputProps) {
  const id = useId();

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <div className="relative">
        <Icon
          name="search"
          size={16}
        />

        <input
          list={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        <datalist id={id}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
    </label>
  );
}