import type { UnitModel } from "../../models/projectModel";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Icon } from "../Icon";

export function SpreadsheetFilters({
  isAdmin,
  cycle,
  defense,
  setDefense,
  units,
  unitId,
  setUnitId,
  userUnit,
}: {
  isAdmin: boolean;
  cycle: string;
  defense: "Parcial" | "Final";
  setDefense: (defense: "Parcial" | "Final") => void;
  units: UnitModel[];
  unitId: string;
  setUnitId: (unitId: string) => void;
  userUnit: UnitModel | null;
}) {
  return (
    <Card className="mb-8">
      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
        <div>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Defesa
          </span>
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            {(["Parcial", "Final"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition ${defense === option ? "bg-white text-[#143c54] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                onClick={() => setDefense(option)}
              >
                Apresentação {option.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
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
              value={unitId}
              onChange={(event) => setUnitId(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Todas as unidades</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Icon name="folder" size={17} />
              <span className="min-w-0 flex-1 text-sm text-slate-700">
                {userUnit?.name ?? "Unidade vinculada à conta"}
              </span>
              <Badge tone="info">Sua unidade</Badge>
            </div>
          )}
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cabeçalho da exportação
          </span>
          <strong className="mt-2 block text-sm font-semibold text-slate-800">
            Apresentação {defense} da Edição {cycle}
          </strong>
          <small className="mt-1 block text-xs leading-relaxed text-slate-500">
            Universidade do Estado do Amazonas •{" "}
            {isAdmin
              ? unitId
                ? units.find((unit) => unit.id === unitId)?.name
                : "Todas as unidades"
              : (userUnit?.name ?? "Sua unidade")}
          </small>
        </div>
      </div>
    </Card>
  );
}
