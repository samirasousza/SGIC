import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Breadcrumbs } from "../../components/Breadcrumbs";

import { projectRows } from "../Projects/ProjectsData";
import { ListPagination } from "../../components/ListPagination";

type EvaluationStage = "Parcial" | "Final";
type EvaluationStatus = "success" | "warning" | "neutral";

const statusSets: EvaluationStatus[][] = [
  ["success", "success", "success", "warning"],
  ["success", "warning", "success", "warning"],
  ["success", "success", "warning", "neutral"],
];

const statusConfig: Record<
  EvaluationStatus,
  { label: string; tone: "success" | "warning" | "neutral"; icon: string }
> = {
  success: {
    label: "Preenchida",
    tone: "success",
    icon: "check",
  },
  warning: {
    label: "Pendente",
    tone: "warning",
    icon: "clock",
  },
  neutral: {
    label: "Não liberada",
    tone: "neutral",
    icon: "close",
  },
};

export function EvaluationsPage({ cycle }: { cycle: string }) {
  const navigate = useNavigate();

  const [stage, setStage] = useState<EvaluationStage>("Parcial");
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [page, setPage] = useState(1);

  const rows = projectRows.filter(
    (project) =>
      project.unit === "EST" &&
      (cycle === "Todos os ciclos" || project.cycle === cycle) &&
      (course === "all" || project.course === course) &&
      (!query.trim() ||
        `${project.title} ${project.student}`
          .toLocaleLowerCase("pt-BR")
          .includes(query.trim().toLocaleLowerCase("pt-BR"))),
  );


  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Avaliações" },
        ]}
      />

      <PageHeader
        title="Avaliações por defesa"
        description="Acompanhe as quatro avaliações obrigatórias de cada projeto da unidade."
      />

      {/* Seleção da etapa */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={() => setStage("Parcial")}
          className={`cursor-pointer flex items-center gap-4 rounded-xl border p-4 text-left transition ${
            stage === "Parcial"
              ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-100"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              stage === "Parcial"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            01
          </span>

          <span>
            <strong className="block text-sm font-semibold text-slate-800">
              Defesa parcial
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              Status das quatro fichas
            </small>
          </span>
        </button>

        <button
          onClick={() => setStage("Final")}
          className={`cursor-pointer flex items-center gap-4 rounded-xl border p-4 text-left transition ${
            stage === "Final"
              ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-100"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              stage === "Final"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            02
          </span>

          <span>
            <strong className="block text-sm font-semibold text-slate-800">
              Defesa final
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              Status das quatro fichas
            </small>
          </span>
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={18} />
          </span>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar projeto ou aluno"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">Todos os cursos</option>
          <option>Ciências Biológicas</option>
          <option>Engenharia Ambiental</option>
          <option>Engenharia Florestal</option>
          <option>Engenharia Química</option>
        </select>
      </div>

      {/* Legenda */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <strong className="text-sm text-slate-700">Legenda:</strong>
        <Badge tone="success">Preenchida</Badge>
        <Badge tone="warning">Pendente</Badge>
        <Badge>Não liberada</Badge>
      </div>

      {/* Matriz de avaliações */}
      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">
            {rows.length} projetos da unidade
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Professor, aluno, avaliador interno e avaliador externo devem
            preencher uma ficha por defesa.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Projeto / aluno</th>
                <th className="px-4 py-3">Professor</th>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Av. interno</th>
                <th className="px-4 py-3">Av. externo</th>
                {/* <th className="px-4 py-3">
                  <span className="sr-only">Acessar avaliação</span>
                </th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((project, rowIndex) => {
                const statuses: EvaluationStatus[] =
                  stage === "Final" && project.progress < 80
                    ? ["neutral", "neutral", "neutral", "neutral"]
                    : statusSets[rowIndex % statusSets.length];

                return (
                  <tr
                    key={`${project.id}-${project.cycle}`}
                    onClick={() =>
                      navigate(`/projects/${project.id}/evaluations`)
                    }
                    className="cursor-pointer transition hover:bg-indigo-50/50"
                  >
                    <td className="px-4 py-4">
                      <strong className="block font-medium text-slate-800">
                        {project.title}
                      </strong>

                      <small className="mt-1 block text-xs text-slate-500">
                        {project.student} • {project.course}
                      </small>
                    </td>

                    {statuses.map((status, index) => {
                      const config = statusConfig[status];

                      return (
                        <td key={index} className="px-4 py-4">
                          <Badge tone={config.tone}>
                            <Icon name={config.icon} size={13} />
                            {config.label}
                          </Badge>
                        </td>
                      );
                    })}

                    {/* <td className="px-4 py-4 text-right">
                      <Icon
                        name="arrow"
                        size={16}
                      />
                    </td> */}
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Nenhum projeto encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ListPagination
          page={page}
          total={rows.length}
          label="projetos"
          onPageChange={setPage}
        />
      </Card>
    </>
  );
}
