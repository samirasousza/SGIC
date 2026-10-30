
import type { Role } from "../pages/Login/LoginTypes";
import { isAdvisorRole } from "../pages/Projects/Projects.utils";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Icon } from "./Icon";

export function EvaluationRecords({
  role,
  stage,
  archived = false,
}: {
  role: Role;
  stage: "Parcial" | "Final";
  archived?: boolean;
}) {
  const all = [
    { person: "Ana Beatriz Martins", profile: "Aluna", status: "Preenchida" },
    {
      person: "Prof. Ricardo Costa",
      profile: "Orientador",
      status: "Preenchida",
    },
    {
      person: "Profa. Marina Araújo",
      profile: "Avaliadora interna",
      status: "Preenchida",
    },
    {
      person: "Prof. Davi",
      profile: "Avaliador externo",
      status: "Pendente",
    },
  ];

  const roleRecords =
    role === "Comitê local" ||
    role === "Apoio técnico" ||
    role === "Administrador"
      ? all
      : isAdvisorRole(role)
        ? all.slice(1)
        : role === "Avaliador"
          ? [all[2]]
          : [all[0]];

  const visible =
    stage === "Final" && !archived
      ? roleRecords.map((item) =>
          item.profile.includes("Avaliador")
            ? { ...item, person: "Não definido", status: "Não definido" }
            : { ...item, status: "Não liberada" },
        )
      : archived
        ? roleRecords.map((item) => ({ ...item, status: "Preenchida" }))
        : roleRecords;

  return (
    <Card>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-800">
          Avaliações {stage.toLowerCase()}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {role === "Comitê local" ||
          role === "Apoio técnico" ||
          role === "Administrador"
            ? "Todas as avaliações vinculadas ao projeto."
            : isAdvisorRole(role)
              ? "Sua avaliação e as avaliações dos membros."
              : "Apenas a avaliação permitida para o seu perfil."}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {visible.map((item) => (
          <div
            key={`${item.profile}-${item.person}`}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Icon name="user" size={17} />
              </span>

              <div className="min-w-0">
                <strong className="block truncate text-sm font-medium text-slate-800">
                  {item.person}
                </strong>

                <small className="text-xs text-slate-500">
                  {item.profile}
                </small>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <Badge
                tone={
                  item.status === "Preenchida"
                    ? "success"
                    : item.status === "Não liberada" ||
                        item.status === "Não definido"
                      ? "neutral"
                      : "warning"
                }
              >
                {item.status}
              </Badge>

              {item.status === "Preenchida" && (
                <Button variant="ghost" icon="download">
                  Baixar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
