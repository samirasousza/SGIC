
import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";

export function UploadModal({ close }: { close: () => void }) {
  const [sent, setSent] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <button
        className="absolute inset-0 cursor-default"
        onClick={close}
        aria-label="Fechar janela"
      />

      <section className="relative z-10 my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Entrega do mês atual
            </span>

            <h2 className="mt-1 text-xl font-semibold text-slate-800">
              {sent ? "Relatório enviado" : "Anexar relatório do mês atual"}
            </h2>
          </div>

          <button
            aria-label="Fechar"
            onClick={close}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="close" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="check" size={32} />
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              Documento enviado com sucesso
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Seu orientador foi notificado e poderá revisar o relatório.
            </p>

            <div className="mt-7">
              <Button onClick={close}>Concluir</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="current-report"
                >
                  Relatório referente ao mês atual
                </label>

                <select
                  id="current-report"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Relatório mensal 6</option>
                  <option>Relatório parcial</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="report-file"
                  className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Icon name="upload" size={24} />
                  </div>

                  <strong className="text-sm font-semibold text-slate-700">
                    Arraste o arquivo ou clique para selecionar
                  </strong>

                  <span className="text-xs text-slate-500">
                    Formato PDF • Tamanho máximo de 10 MB
                  </span>

                  <input
                    id="report-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] ?? null)
                    }
                  />

                  <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Selecionar arquivo
                  </span>

                  {file && (
                    <span className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                      <Icon name="file-check" size={16} />
                      {file.name}
                    </span>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="notes"
                >
                  Observações para o orientador{" "}
                  <span className="font-normal text-slate-400">
                    (Opcional)
                  </span>
                </label>

                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Inclua informações importantes sobre esta entrega..."
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                <span>
                  Confirmo que este é o documento final para avaliação.
                </span>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={close}>
                Cancelar
              </Button>

              <Button
                icon="upload"
                disabled={!file}
                onClick={() => setSent(true)}
              >
                Enviar relatório
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
