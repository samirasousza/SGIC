import type { ProjectEvaluationsModel } from "../../models/evaluationModel";
import { DownloadEvaluationForm } from "../../services/evaluationsService";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Card } from "../Card";
import { Icon } from "../Icon";

function labelFor(form: ProjectEvaluationsModel["defenses"][number]["forms"][number]) {
  if (form.formType === "STUDENT") return "Aluno";
  if (form.formType === "ADVISOR") return "Orientador";
  return form.memberType === "INTERNAL" ? "Avaliador interno" : "Avaliador externo";
}

function statusFor(state: string) {
  switch (state) {
    case "SIGNED": return { label: "Preenchida", tone: "success" as const };
    case "IN_PROGRESS": return { label: "Em preenchimento", tone: "warning" as const };
    case "PENDING": return { label: "Pendente", tone: "warning" as const };
    default: return { label: "Não liberada", tone: "neutral" as const };
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

  const handleReopen = async (id: string) => {
    const justification = window.prompt("Informe a justificativa para reabrir esta avaliação:")?.trim();
    if (!justification) return;
    await onReopen(id, justification);
  };

  return (
    <Card>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-800">Avaliações da defesa</h2>
        <p className="mt-1 text-sm text-slate-500">Situação das fichas que seu perfil tem permissão para acompanhar.</p>
      </div>
      <div className="divide-y divide-slate-100">
        {forms.map((form, index) => {
          const status = statusFor(form.state);
          const name = form.author?.name ?? labelFor(form);
          return (
            <div key={`${form.formType}-${form.memberType ?? index}`} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Icon name="user" size={17} />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-medium text-slate-800">{name}</strong>
                  <small className="text-xs text-slate-500">{labelFor(form)}</small>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Badge tone={status.tone}>{status.label}</Badge>
                {form.canOpen && form.evaluationId && (
                  <Button variant="ghost" icon="download" onClick={() => void downloadPdf(form.evaluationId!)}>
                    Baixar PDF
                  </Button>
                )}
                {form.canReopen && form.evaluationId && (
                  <Button variant="secondary" onClick={() => void handleReopen(form.evaluationId!)}>
                    Reabrir
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {forms.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-500">Nenhuma avaliação disponível.</p>}
      </div>
    </Card>
  );
}
