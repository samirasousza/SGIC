
import type { projectRows } from "../pages/Projects/ProjectsData";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { Data } from "./Data";
import { Icon } from "./Icon";

export function EvaluationDefenseSummary({
  stage,
  project,
  archived,
}: {
  stage: "Parcial" | "Final";
  project: (typeof projectRows)[number];
  archived: boolean;
}) {
  const locked = stage === "Final" && !archived;

  const participants = [
    {
      name: project.student,
      email: "aluno@uea.edu.br",
      role: "Aluno",
      status: locked ? "Não liberada" : "Preenchida",
      date: locked ? "—" : "20 mar 2026, 09h18",
    },
    {
      name: `Prof. ${project.advisor}`,
      email: "orientador@uea.edu.br",
      role: "Orientador",
      status: locked ? "Não liberada" : "Preenchida",
      date: locked ? "—" : "21 mar 2026, 16h42",
    },
    {
      name: "Profa. Marina Araújo",
      email: "avaliadorinterno@uea.edu.br",
      role: "Avaliadora interna",
      status: locked ? "Não liberada" : "Preenchida",
      date: locked ? "—" : "24 mar 2026, 15h32",
    },
    {
      name: "Prof. Davi",
      email: "avaliador@uea.edu.br",
      role: "Avaliador externo",
      status: locked ? "Não liberada" : "Pendente",
      date: locked ? "—" : "Ainda não preenchida",
    },
  ];

  return (
    <Card>
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Dados da defesa e avaliações
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Informações da banca e situação das quatro fichas obrigatórias.
            </p>
          </div>

          {/* <Badge tone={locked ? "neutral" : "info"}>
            {stage === "Parcial" ? "Defesa parcial" : "Defesa final"}
          </Badge> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 border-b border-slate-100 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
        <Data
          label="Data da defesa"
          value={
            locked
              ? "A definir no mês 11"
              : stage === "Parcial"
                ? "24 mar 2026"
                : "18 set 2025"
          }
        />

        <Data label="Horário" value={locked ? "—" : "14h"} />

        <Data label="Local" value={locked ? "—" : "Sala 203 — EST"} />

        <Data
          label="Prazo das avaliações"
          value={locked ? "Ainda não liberado" : "31 mar 2026, 23h59"}
        />

        <Data
          label="Avaliadora interna"
          value={locked ? "Ainda não definida" : "Profa. Marina Araújo"}
        />

        <Data
          label="Avaliador externo"
          value={locked ? "Ainda não definido" : "Prof. Davi"}
        />
      </div>

      <div className="divide-y divide-slate-100">
        {participants.map((participant) => (
          <div
            key={participant.role}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon name="user" size={17} />
            </span>

            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-medium text-slate-800">
                {participant.name}
              </strong>

              <small className="block truncate text-xs text-slate-500">
                {participant.email}
              </small>

              <small className="mt-1 block text-xs text-slate-400">
                {participant.role} • {participant.date}
              </small>
            </div>

            <Badge
              tone={
                participant.status === "Preenchida"
                  ? "success"
                  : participant.status === "Pendente"
                    ? "warning"
                    : "neutral"
              }
            >
              {participant.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
