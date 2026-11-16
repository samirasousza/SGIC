import type { ProjectDetailsModel } from "../../models/projectModel";
import type { DefenseBoardModel } from "../../models/projectBoardModel";
import type { ProjectEvaluationsModel } from "../../models/evaluationModel";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Data } from "../Data";
import { Icon } from "../Icon";

function formatDate(value: string | null | undefined) {
  if (!value) return "Não definido";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

function stateLabel(state?: string | null) {
  switch (state) {
    case "SIGNED": return "Preenchida";
    case "IN_PROGRESS": return "Em preenchimento";
    case "PENDING": return "Pendente";
    case "NOT_RELEASED": return "Não liberada";
    default: return "Não disponível";
  }
}

function stateTone(state?: string | null): "success" | "warning" | "neutral" {
  if (state === "SIGNED") return "success";
  if (state === "PENDING" || state === "IN_PROGRESS") return "warning";
  return "neutral";
}

export function EvaluationDefenseSummary({
  project,
  board,
  defense,
}: {
  project: ProjectDetailsModel;
  board: DefenseBoardModel | undefined;
  defense: ProjectEvaluationsModel["defenses"][number] | undefined;
}) {
  const participants = (defense?.forms ?? []).map((form) => {
    const profile = form.formType === "STUDENT"
      ? "Aluno"
      : form.formType === "ADVISOR"
        ? "Orientador"
        : form.memberType === "INTERNAL"
          ? "Avaliador interno"
          : "Avaliador externo";
    const suggested = board?.members.find((member) => member.memberType === form.memberType);
    return {
      key: `${form.formType}-${form.memberType ?? "none"}`,
      name: form.author?.name ?? suggested?.suggestedName ?? "Vaga não indicada",
      email: form.author?.email ?? suggested?.evaluator?.email ?? "",
      profile,
      state: form.state,
      signedAt: form.signedAt,
    };
  });

  return (
    <Card>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-800">Dados da defesa e avaliações</h2>
        <p className="mt-1 text-sm text-slate-500">Agendamento da banca e situação das fichas disponíveis para seu perfil.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 border-b border-slate-100 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
        <Data label="Data da defesa" value={formatDate(board?.defenseDate)} />
        <Data label="Horário" value={board?.defenseTime?.slice(0, 5) ?? "Não definido"} />
        <Data label="Local" value={board?.location ?? "Não definido"} />
        <Data label="Aluno" value={project.student.name} />
        <Data label="Orientador" value={project.advisor.name} />
        <Data label="Unidade" value={`${project.unit.name} (${project.unit.acronym})`} />
      </div>

      <div className="divide-y divide-slate-100">
        {participants.map((participant) => (
          <div key={participant.key} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon name="user" size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-medium text-slate-800">{participant.name}</strong>
              {participant.email && <small className="block truncate text-xs text-slate-500">{participant.email}</small>}
              <small className="mt-1 block text-xs text-slate-400">{participant.profile} • {participant.signedAt ? `Assinada em ${formatDate(participant.signedAt)}` : "Sem assinatura"}</small>
            </div>
            <Badge tone={stateTone(participant.state)}>{stateLabel(participant.state)}</Badge>
          </div>
        ))}
        {participants.length === 0 && (
          <p className="px-5 py-6 text-sm text-slate-500">Não há informações de avaliações disponíveis para esta defesa.</p>
        )}
      </div>
    </Card>
  );
}
