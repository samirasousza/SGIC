import { useState } from "react";
import type { ProjectEvaluationsModel } from "../../models/evaluationModel";
import { DownloadEvaluationForm } from "../../services/evaluationsService";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Card } from "../Card";
import { Icon } from "../Icon";

function labelFor(
  form: ProjectEvaluationsModel["defenses"][number]["forms"][number],
) {
  if (form.formType === "STUDENT") return "Aluno";
  if (form.formType === "ADVISOR") return "Orientador";
  return form.memberType === "INTERNAL"
    ? "Avaliador interno"
    : "Avaliador externo";
}

function statusFor(state: string) {
  switch (state) {
    case "SIGNED":
      return { label: "Preenchida", tone: "success" as const };
    case "IN_PROGRESS":
      return { label: "Em preenchimento", tone: "warning" as const };
    case "PENDING":
      return { label: "Pendente", tone: "warning" as const };
    default:
      return { label: "Não liberada", tone: "neutral" as const };
  }
}

async function downloadPdf(id: string) {
  const blob = await DownloadEvaluationForm(id);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `avaliacao-${id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function EvaluationRecords({
  defense,
  onReopen,
}: {
  defense: ProjectEvaluationsModel["defenses"][number] | undefined;
  onReopen: (id: string, justification: string) => Promise<void>;
}) {
  const forms = defense?.forms ?? [];
  const [reopenId, setReopenId] = useState<string | null>(null);
  const [justification, setJustification] = useState("");
  const [reopening, setReopening] = useState(false);
  const [reopenError, setReopenError] = useState("");

  const handleReopen = async () => {
    if (!reopenId || !justification.trim()) return;
    setReopening(true);
    setReopenError("");
    try {
      await onReopen(reopenId, justification.trim());
      setReopenId(null);
      setJustification("");
    } catch {
      setReopenError("Não foi possível reabrir a avaliação. Tente novamente.");
    } finally {
      setReopening(false);
    }
  };

  return (
    <Card>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-800">
          Avaliações da defesa
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Situação das fichas que seu perfil tem permissão para acompanhar.
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {forms.map((form, index) => {
          const status = statusFor(form.state);
          const name = form.author?.name ?? labelFor(form);
          return (
            <div
              key={`${form.formType}-${form.memberType ?? index}`}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Icon name="user" size={17} />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-medium text-slate-800">
                    {name}
                  </strong>
                  <small className="text-xs text-slate-500">
                    {labelFor(form)}
                  </small>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Badge tone={status.tone}>{status.label}</Badge>
                {form.canOpen && form.evaluationId && (
                  <Button
                    variant="ghost"
                    icon="download"
                    onClick={() => void downloadPdf(form.evaluationId!)}
                  >
                    Baixar PDF
                  </Button>
                )}
                {form.canReopen && form.evaluationId && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setReopenId(form.evaluationId!);
                      setJustification("");
                      setReopenError("");
                    }}
                  >
                    Reabrir
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {forms.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            Nenhuma avaliação disponível.
          </p>
        )}
      </div>
      {reopenId && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reopen-evaluation-title"
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 p-6">
              <h3
                id="reopen-evaluation-title"
                className="text-lg font-bold text-slate-900"
              >
                Justificativa para reabertura
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Informe o motivo pelo qual esta avaliação precisa ser reaberta.
              </p>
            </div>
            <div className="p-6">
              <textarea
                value={justification}
                onChange={(event) => setJustification(event.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Descreva a justificativa..."
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {justification.length}/2000
              </p>
              {reopenError && (
                <p role="alert" className="mt-3 text-sm text-rose-600">
                  {reopenError}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 p-4">
              <Button
                variant="secondary"
                disabled={reopening}
                onClick={() => setReopenId(null)}
              >
                Cancelar
              </Button>
              <Button
                disabled={reopening || !justification.trim()}
                onClick={() => void handleReopen()}
              >
                {reopening ? "Reabrindo..." : "Confirmar reabertura"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </Card>
  );
}
