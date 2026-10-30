import { useState } from "react";
import { Button } from "../Button";
import { Data } from "../Data";
import { Icon } from "../Icon";
import type { spreadsheetDefinitions } from "../../pages/Spreadsheets/SpreadsheetUtils";

export function SpreadsheetExportModal({
  sheet,
  defense,
  cycle,
  unit,
  close,
  exportFile,
}: {
  sheet: (typeof spreadsheetDefinitions)[number];
  defense: string;
  cycle: string;
  unit: string;
  close: () => void;
  exportFile: (format: string) => void;
}) {
  const [format, setFormat] = useState("Excel");

  const formats = [
    {
      name: "Excel",
      extension: ".xlsx",
      description: "Layout oficial",
      icon: "file",
    },
    {
      name: "PDF",
      extension: ".pdf",
      description: "Pronto para envio",
      icon: "file",
    },
  ];

  const recordCount = sheet.id === 1 ? "18" : sheet.id === 3 ? "12" : "6";

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
        {/* Cabeçalho */}
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

        {/* Conteúdo */}
        <div className="space-y-6 p-6">
          {/* Resumo da exportação */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Resumo da exportação
            </h3>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <Data label="Defesa" value={`Apresentação ${defense}`} />
              <Data label="Ciclo" value={cycle} />
              <Data label="Unidade" value={unit} />
              <Data label="Registros" value={recordCount} />
            </div>
          </div>

          {/* Seleção de formato */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Formato do arquivo
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {formats.map((item) => {
                const selected = format === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormat(item.name)}
                    aria-pressed={selected}
                    className={`cursor-pointer flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
                      selected
                        ? "border-[#143c54] bg-[#143c54]/5 ring-2 ring-[#143c54]/10"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-[#143c54] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon name={item.icon} size={20} />
                    </span>

                    <strong
                      className={`text-sm font-semibold ${
                        selected ? "text-[#143c54]" : "text-slate-700"
                      }`}
                    >
                      {item.name}
                    </strong>

                    <small className="text-xs text-slate-400">
                      {item.extension} • {item.description}
                    </small>

                    {selected && (
                      <span className="mt-1 flex items-center gap-1 text-xs font-medium text-[#143c54]">
                        <Icon name="check-circle" size={13} />
                        Selecionado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>

          <Button icon="download" onClick={() => exportFile(format)}>
            Gerar e baixar {format}
          </Button>
        </div>
      </section>
    </div>
  );
}
