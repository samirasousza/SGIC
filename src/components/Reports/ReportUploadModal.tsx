import { useState } from "react";

import { Badge } from "../Badge";
import { Button } from "../Button";
import { Icon } from "../Icon";
import type { ReportModel } from "../../models/reportModel";
import {
  DeleteReportDraft,
  DownloadReportDraft,
  PutReportDraft,
  SubmitReport,
} from "../../services/reportsService";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ReportUploadModal({
  report,
  close,
  onUpdated,
}: {
  report: ReportModel;
  close: () => void;
  onUpdated: (report: ReportModel) => void;
}) {
  const [currentReport, setCurrentReport] = useState(report);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function uploadDraft() {
    if (!file) {
      setError("Selecione um arquivo PDF.");
      return;
    }
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("O arquivo precisa estar no formato PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("O arquivo deve ter no máximo 10 MB.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updated = await PutReportDraft(currentReport.id, file);
      setCurrentReport(updated);
      onUpdated(updated);
      setFile(null);
    } catch {
      setError(
        "Não foi possível anexar o arquivo. Verifique se o PDF é válido e tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeDraft() {
    setSaving(true);
    setError("");
    try {
      const updated = await DeleteReportDraft(currentReport.id);
      setCurrentReport(updated);
      onUpdated(updated);
    } catch {
      setError("Não foi possível remover o arquivo anexado.");
    } finally {
      setSaving(false);
    }
  }

  async function submitReport() {
    setSaving(true);
    setError("");
    try {
      const updated = await SubmitReport(currentReport.id);
      setCurrentReport(updated);
      onUpdated(updated);
      close();
    } catch {
      setError(
        "Não foi possível enviar o relatório. Confirme se há um PDF anexado.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function downloadDraft() {
    try {
      const blob = await DownloadReportDraft(currentReport.id);
      downloadBlob(blob, currentReport.draft?.fileName ?? "rascunho.pdf");
    } catch {
      setError("Não foi possível baixar o rascunho.");
    }
  }

  const title =
    currentReport.type === "MONTHLY"
      ? `Relatório mensal ${currentReport.referenceMonth}`
      : currentReport.type === "PARTIAL"
        ? "Relatório parcial"
        : "Relatório final";

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-slate-950/50"
        onClick={close}
        aria-label="Fechar envio de relatório"
      />
      <section className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Envio de relatório
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Anexe um arquivo PDF de até 10 MB. O envio cria uma versão no
              histórico.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="space-y-4 p-6">
          {error && (
            <p
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          {currentReport.draft && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <div className="min-w-0">
                <Badge tone="warning">Rascunho anexado</Badge>
                <p className="mt-2 truncate text-sm font-medium text-slate-800">
                  {currentReport.draft.fileName}
                </p>
                <p className="text-xs text-slate-500">
                  {(currentReport.draft.fileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" icon="download" onClick={downloadDraft}>
                  Baixar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setConfirmRemove(true)}
                  disabled={saving}
                >
                  Remover
                </Button>
              </div>
            </div>
          )}

          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
            <Icon name="upload" size={28} />
            <span className="mt-2 block text-sm font-medium text-slate-800">
              {currentReport.draft
                ? "Substituir arquivo PDF"
                : "Selecione o PDF do relatório"}
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Formato PDF • Até 10 MB
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={async (event) => {
                const selectedFile = event.target.files?.[0] ?? null;

                if (!selectedFile) return;

                setFile(selectedFile);
                setError("");

                if (
                  selectedFile.type !== "application/pdf" &&
                  !selectedFile.name.toLowerCase().endsWith(".pdf")
                ) {
                  setError("O arquivo precisa estar no formato PDF.");
                  setFile(null);
                  return;
                }

                if (selectedFile.size > 10 * 1024 * 1024) {
                  setError("O arquivo deve ter no máximo 10 MB.");
                  setFile(null);
                  return;
                }

                setSaving(true);

                try {
                  const updated = await PutReportDraft(
                    currentReport.id,
                    selectedFile,
                  );
                  setCurrentReport(updated);
                  onUpdated(updated);
                  setFile(null);
                } catch {
                  setError(
                    "Não foi possível anexar o arquivo. Verifique se o PDF é válido e tente novamente.",
                  );
                } finally {
                  setSaving(false);
                  event.target.value = "";
                }
              }}
            />
            {file && (
              <span className="mt-3 block truncate text-sm text-indigo-700">
                {file.name}
              </span>
            )}
          </label>

          {currentReport.draft && (
            <p className="text-sm text-slate-600">
              O arquivo está anexado como rascunho. Clique em enviar para criar
              uma nova versão e encaminhá-la ao orientador.
            </p>
          )}
        </div>

        <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
          <Button variant="secondary" onClick={close}>
            Fechar
          </Button>
          <Button
            onClick={submitReport}
            disabled={!currentReport.draft || !!file || saving}
          >
            Enviar relatório
          </Button>
        </footer>
        {confirmRemove && (
          <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/50 p-4">
            <section
              role="dialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900">
                Remover rascunho?
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                O arquivo anexado será excluído permanentemente. Esta ação não
                pode ser desfeita.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  disabled={saving}
                  onClick={() => setConfirmRemove(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  disabled={saving}
                  onClick={async () => {
                    await removeDraft();
                    setConfirmRemove(false);
                  }}
                >
                  {saving ? "Removendo..." : "Remover rascunho"}
                </Button>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
