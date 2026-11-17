import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Icon } from "./Icon";

interface SearchableInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function SearchableInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Buscar por nome ou e-mail",
}: SearchableInputProps) {
  const id = useId();
  const listId = `${id}-list`;
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const term = normalize(value.trim());
    if (!term) return options;
    return options.filter((option) => normalize(option).includes(term));
  }, [options, value]);

  // Fecha ao clicar fora do componente.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function select(option: string) {
    onChange(option);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && open && filtered[activeIndex]) {
      event.preventDefault();
      select(filtered[activeIndex]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name="search" size={16} />
        </span>

        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={value}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center">
          {value && (
            <button
              type="button"
              aria-label="Limpar"
              onClick={() => {
                onChange("");
                setActiveIndex(0);
              }}
              className="cursor-pointer rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Icon name="close" size={14} />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label={open ? "Fechar opções" : "Abrir opções"}
            onClick={() => setOpen((current) => !current)}
            className="cursor-pointer rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <span
              className={`block transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
            >
              <Icon name="arrow" size={14} />
            </span>
          </button>
        </div>

        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-400">
                Nenhum resultado encontrado
              </li>
            ) : (
              filtered.map((option, index) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  // mousedown (e não click) para selecionar antes do blur
                  onMouseDown={(event) => {
                    event.preventDefault();
                    select(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`cursor-pointer px-3 py-2 text-sm ${
                    index === activeIndex
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700"
                  } ${option === value ? "font-semibold" : ""}`}
                >
                  {option}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
