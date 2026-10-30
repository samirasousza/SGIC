import { Badge } from "../Badge";
import { Card } from "../Card";
import { Icon } from "../Icon";
import type { Role } from "../../pages/Login/LoginTypes";

interface SpreadsheetFiltersProps {
  role: Role;
  cycle: string;
  defense: "Parcial" | "Final";
  setDefense: (defense: "Parcial" | "Final") => void;
  unit: string;
  setUnit: (unit: string) => void;
}

export function SpreadsheetFilters({
  role,
  cycle,
  defense,
  setDefense,
  unit,
  setUnit,
}: SpreadsheetFiltersProps) {
  const isAdmin = role === "Administrador";

  return (
    <Card className="mb-8">
      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
        {/* Defesa */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Defesa
          </span>

          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition ${
                defense === "Parcial"
                  ? "bg-white text-[#143c54] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => setDefense("Parcial")}
            >
              Apresentação parcial
            </button>

            <button
              type="button"
              className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition ${
                defense === "Final"
                  ? "bg-white text-[#143c54] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => setDefense("Final")}
            >
              Apresentação final
            </button>
          </div>
        </div>

        {/* Unidade */}
        <div>
          <label
            htmlFor="spreadsheet-unit"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Unidade
          </label>

          {isAdmin ? (
            <select
              id="spreadsheet-unit"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>Escola Superior de Tecnologia</option>
              <option>Escola Superior de Ciências da Saúde</option>
              <option>Centro de Estudos Superiores de Parintins</option>
              <option>Todas as unidades</option>
            </select>
          ) : (
            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Icon name="folder" size={17} />

              <span className="min-w-0 flex-1 text-sm text-slate-700">
                {unit}
              </span>

              <Badge tone="info">Sua unidade</Badge>
            </div>
          )}
        </div>

        {/* Contexto da exportação */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cabeçalho da exportação
          </span>

          <strong className="mt-2 block text-sm font-semibold text-slate-800">
            Apresentação {defense} da Edição {cycle}
          </strong>

          <small className="mt-1 block text-xs leading-relaxed text-slate-500">
            Universidade do Estado do Amazonas • {unit}
          </small>
        </div>
      </div>
    </Card>
  );
}
