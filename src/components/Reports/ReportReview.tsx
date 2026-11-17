import { useState } from "react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Icon } from "../Icon";
import type { ReportModel, ReportVersionModel } from "../../models/reportModel";
import {
  DownloadReport,
  ReopenReport,
  ReviewReport as ReviewReportRequest,
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

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function versionStatus(version: ReportVersionModel) {
  if (!version.reviewDecision)
    return { label: "Aguardando revisão", tone: "warning" as const };
  if (version.reviewDecision === "APPROVED")
    return { label: "Aprovada", tone: "success" as const };
  return { label: "Ajustes solicitados", tone: "orange" as const };
}

export function ReportReview({
  report,
  canReview,
  canReopen,
  close,
  onUpdated,
}: {
  report: ReportModel;
  canReview: boolean;
  canReopen: boolean;
  close: () => void;
  onUpdated: (report: ReportModel) => void;
}) {
  const [comment, setComment] = useState("");
  const [justification, setJustification] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showReopenForm, setShowReopenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const title =
    report.type === "MONTHLY"
      ? `Relatório mensal ${report.referenceMonth}`
      : report.type === "PARTIAL"
        ? "Relatório parcial"
        : "Relatório final";
  const awaitingReview =
    report.status === "UNDER_REVIEW" || report.status === "RESUBMITTED";
  const latestVersion = report.versions[report.versions.length - 1];

  async function review(decision: "APPROVED" | "CHANGES_REQUESTED") {
    if (decision === "CHANGES_REQUESTED" && !comment.trim()) {
      setError("Informe os ajustes necessários.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updated = await ReviewReportRequest(report.id, {
        decision,
        ...(decision === "CHANGES_REQUESTED"
          ? { comment: comment.trim() }
          : {}),
      });
      onUpdated(updated);
      setShowCommentForm(false);
      setComment("");
    } catch {
      setError(
        "Não foi possível registrar a revisão. Atualize a página e tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function reopen() {
    if (!justification.trim()) {
      setError("Informe a justificativa para reabrir o relatório.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updated = await ReopenReport(report.id, {
        justification: justification.trim(),
      });
      onUpdated(updated);
      setShowReopenForm(false);
      setJustification("");
    } catch {
      setError(
        "Não foi possível reabrir o relatório. Verifique se ele está aprovado.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function downloadVersion(version: ReportVersionModel) {
    try {
      const blob = await DownloadReport(report.id, version.versionNumber);
      downloadBlob(blob, version.fileName);
    } catch {
      setError(`Não foi possível baixar a versão ${version.versionNumber}.`);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-slate-950/50"
        onClick={close}
        aria-label="Fechar histórico"
      />
      <section className="relative z-10 max-h-[calc(100vh-32px)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Histórico do documento
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {report.versions.length} versão(ões) enviada(s)
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

        <div className="space-y-5 p-6">
          {error && (
            <p
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          {report.versions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Ainda não há versões enviadas.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...report.versions].reverse().map((version) => {
                const status = versionStatus(version);
                return (
                  <div
                    key={version.versionNumber}
                    className="flex flex-wrap items-start gap-3 py-4 first:pt-0"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                      V{version.versionNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block break-all text-sm text-slate-800">
                        {version.fileName}
                      </strong>
                      <p className="mt-1 text-xs text-slate-500">
                        Enviada em {formatDate(version.submittedAt)}
                        {version.submittedLate ? " • Enviada com atraso" : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge tone={status.tone}>{status.label}</Badge>
                        {version.reviewedAt && (
                          <span className="text-xs text-slate-500">
                            Revisada em {formatDate(version.reviewedAt)}
                          </span>
                        )}
                        {version.reviewedBy && (
                          <span className="text-xs text-slate-500">
                            por {version.reviewedBy.name}
                          </span>
                        )}
                      </div>
                      {version.reviewComment && (
                        <p className="mt-3 rounded-r border-l-2 border-amber-400 bg-amber-50 p-3 text-sm text-slate-700">
                          {version.reviewComment}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      icon="download"
                      onClick={() => downloadVersion(version)}
                    >
                      Baixar PDF
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {canReview && awaitingReview && latestVersion && (
            <div className="border-t border-slate-100 pt-5">
              {showCommentForm ? (
                <div className="space-y-3">
                  <label
                    htmlFor="report-review-comment"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Comentários sobre os ajustes necessários
                  </label>
                  <textarea
                    id="report-review-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    maxLength={5000}
                    placeholder="Descreva os ajustes que o aluno deve realizar..."
                    className="w-full resize-y rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => review("CHANGES_REQUESTED")}
                      disabled={!comment.trim() || saving}
                    >
                      Enviar solicitação de ajustes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    icon="check"
                    onClick={() => review("APPROVED")}
                    disabled={saving}
                  >
                    Aprovar relatório
                  </Button>
                  <Button onClick={() => setShowCommentForm(true)}>
                    Solicitar ajustes
                  </Button>
                </div>
              )}
            </div>
          )}

          {canReopen && report.status === "APPROVED" && (
            <div className="border-t border-slate-100 pt-5">
              {showReopenForm ? (
                <div className="space-y-3">
                  <label
                    htmlFor="report-reopen-justification"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Justificativa para reabertura
                  </label>
                  <textarea
                    id="report-reopen-justification"
                    value={justification}
                    onChange={(event) => setJustification(event.target.value)}
                    rows={3}
                    maxLength={5000}
                    placeholder="Informe por que este relatório precisa ser reaberto..."
                    className="w-full resize-y rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowReopenForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={reopen}
                      disabled={!justification.trim() || saving}
                    >
                      Confirmar reabertura
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setShowReopenForm(true)}
                >
                  Reabrir relatório
                </Button>
              )}
            </div>
          )}
        </div>

        <footer className="flex justify-end border-t border-slate-100 bg-slate-50 p-4">
          <Button onClick={close}>Fechar</Button>
        </footer>
      </section>
    </div>
  );
}
