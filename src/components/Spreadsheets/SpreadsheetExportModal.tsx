import { useState } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import type { SpreadsheetDefinition } from "../../models/spreadsheetModel";
import type { ExportFormat } from "../../types/spreadsheetType";

export function SpreadsheetExportModal({
  sheet,
  defense,
  cycle,
  unitLabel,
  close,
  exportFile,
  exporting,
}: {
  sheet: SpreadsheetDefinition;
  defense: "Parcial" | "Final";
  cycle: string;
  unitLabel: string;
  close: () => void;
  exportFile: (format: ExportFormat) => void;
  exporting: boolean;
}) {
  const [format, setFormat] = useState<ExportFormat>("XLSX");
  const formats: {
    name: string;
    extension: string;
    description: string;
    value: ExportFormat;
  }[] = [
    {
      name: "Excel",
      extension: ".xlsx",
      description: "Planilha editável",
      value: "XLSX",
    },
    {
      name: "CSV",
      extension: ".csv",
      description: "Dados separados por vírgula",
      value: "CSV",
    },
    {
      name: "PDF",
      extension: ".pdf",
      description: "Documento para visualização",
      value: "PDF",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        onClick={close}
        aria-label="Fechar exportação"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="relative z-10 my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Gerar planilha oficial
            </span>
            <h2
              id="export-modal-title"
              className="mt-1 text-lg font-semibold text-slate-800"
            >
              {sheet.title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="close" size={19} />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Resumo da exportação
            </h3>
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div>
                <span className="block text-xs text-slate-500">Defesa</span>
                <strong className="text-sm text-slate-800">
                  Apresentação {defense}
                </strong>
              </div>
              <div>
                <span className="block text-xs text-slate-500">Ciclo</span>
                <strong className="text-sm text-slate-800">{cycle}</strong>
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-slate-500">Unidade</span>
                <strong className="text-sm text-slate-800">{unitLabel}</strong>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Formato do arquivo
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {formats.map((item) => {
                const selected = format === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFormat(item.value)}
                    aria-pressed={selected}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${selected ? "border-[#143c54] bg-[#143c54]/5 ring-2 ring-[#143c54]/10" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${selected ? "bg-[#143c54] text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      <Icon name="file" size={20} />
                    </span>
                    <strong
                      className={`text-sm font-semibold ${selected ? "text-[#143c54]" : "text-slate-700"}`}
                    >
                      {item.name}
                    </strong>
                    <small className="text-xs text-slate-400">
                      {item.extension} • {item.description}
                    </small>
                    {selected && (
                      <span className="mt-1 flex items-center gap-1 text-xs font-medium text-[#143c54]">
                        <Icon name="check" size={13} />
                        Selecionado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {sheet.sensitive && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Esta planilha contém dados pessoais (CPF). Armazene e compartilhe
              o arquivo com cuidado.
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={close} disabled={exporting}>
            Cancelar
          </Button>
          <Button
            icon="download"
            onClick={() => exportFile(format)}
            disabled={exporting}
          >
            {exporting
              ? "Gerando..."
              : `Gerar e baixar ${formats.find((item) => item.value === format)?.name}`}
          </Button>
        </div>
      </section>
    </div>
  );
}
