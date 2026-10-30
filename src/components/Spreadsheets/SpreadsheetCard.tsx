import { Badge } from "../Badge";
import { Button } from "../Button";
import { Card } from "../Card";
import { Icon } from "../Icon";
import type { spreadsheetDefinitions } from "../../pages/Spreadsheets/SpreadsheetUtils";

type Spreadsheet = (typeof spreadsheetDefinitions)[number];

export function SpreadsheetCard({
  sheet,
  defense,
  cycleRequired,
  onExport,
}: {
  sheet: Spreadsheet;
  defense: "Parcial" | "Final";
  cycleRequired: boolean;
  onExport: () => void;
}) {
  const finalOnlyDisabled =
    sheet.availability === "Somente final" && defense !== "Final";

  const disabled = finalOnlyDisabled || cycleRequired;

  const recordCount = sheet.id === 1 ? "18" : sheet.id === 3 ? "12" : "6";

  return (
    <Card
      className={`flex h-full flex-col transition ${
        disabled ? "opacity-60" : "hover:border-slate-300"
      }`}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">
            {String(sheet.id).padStart(2, "0")}
          </span>

          <div className="flex flex-wrap justify-end gap-2">
            {sheet.sensitive && <Badge tone="warning">Contém CPF</Badge>}

            <Badge
              tone={sheet.availability === "Somente final" ? "neutral" : "info"}
            >
              {sheet.availability}
            </Badge>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-800">
          {sheet.title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {sheet.description}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <strong className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Colunas do modelo
          </strong>

          <div className="mt-3 flex flex-wrap gap-2">
            {sheet.columns.map((column) => (
              <span
                key={column}
                className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
              >
                {column}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {finalOnlyDisabled ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-700">
              <Icon name="clock" size={15} />
              Disponível apenas na defesa final
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              {recordCount} registros no escopo
            </span>
          )}

          <Button
            variant="secondary"
            icon="download"
            disabled={disabled}
            onClick={onExport}
          >
            Exportar
          </Button>
        </div>
      </div>
    </Card>
  );
}
