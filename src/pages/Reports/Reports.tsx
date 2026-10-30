import type { Role } from "../Login/LoginTypes";
import { projectRows } from "../Projects/ProjectsData";
import {
  isMentorRole,
  advisorNameForAccount,
} from "../Projects/Projects.utils";
import { Badge } from "../../components/Badge";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { ListPagination } from "../../components/ListPagination";
import { PageHeader } from "../../components/PageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const matrixStatuses = [
  [
    "success",
    "success",
    "success",
    "success",
    "success",
    "warning",
    "orange",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "warning",
    "neutral",
  ],
  [
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "warning",
    "neutral",
    "success",
    "orange",
  ],
  [
    "success",
    "success",
    "danger",
    "success",
    "warning",
    "orange",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "orange",
    "neutral",
  ],
  [
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "success",
    "warning",
    "orange",
    "neutral",
    "neutral",
    "neutral",
    "success",
    "neutral",
  ],
];

const statusLabels: Record<string, string> = {
  success: "Aprovado",
  warning: "Em análise / ajustes",
  orange: "Pendente",
  danger: "Atrasado",
  neutral: "Não disponível",
};

interface ReportsPageProps {
  role: Role;
  accountRole: Role;
  cycle: string;
}

export function ReportsPage({
  role,
  accountRole,
  cycle,
}: ReportsPageProps) {
  const navigate = useNavigate();

  const [sort, setSort] = useState<"az" | "za">("az");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(
    isMentorRole(role) || role === "Aluno" ? "mine" : "all",
  );
  const [course, setCourse] = useState("all");

  const ownProjects = projectRows
    .filter((item) => item.advisor === "Ricardo Costa")
    .map((item) => ({
      ...item,
      advisor: advisorNameForAccount(role, accountRole),
    }));

  const allowedProjects =
    role === "Aluno"
      ? projectRows
          .filter((item) => item.student === "Ana Beatriz Martins")
          .map((item) => ({ ...item, student: "Samira" }))
      : isMentorRole(role) || scope === "mine"
        ? ownProjects
        : role === "Apoio técnico"
          ? projectRows.filter((item) => item.unit === "EST")
          : projectRows;

  const cycleProjects =
    cycle === "Todos os ciclos"
      ? allowedProjects
      : allowedProjects.filter((item) => item.cycle === cycle);

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  const filteredProjects = cycleProjects.filter(
    (item) =>
      (course === "all" || item.course === course) &&
      (!normalizedQuery ||
        item.title.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        item.student.toLocaleLowerCase("pt-BR").includes(normalizedQuery)),
  );

  const visibleProjects = [...filteredProjects].sort((first, second) =>
    sort === "az"
      ? first.title.localeCompare(second.title, "pt-BR")
      : second.title.localeCompare(first.title, "pt-BR"),
  );

  const pageSize = 10;
  const pageProjects = visibleProjects.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Relatórios" },
        ]}
      />

      <PageHeader
        eyebrow="Acompanhamento de entregas"
        title="Relatórios por projeto"
        description="Consulte a situação de cada relatório no ciclo selecionado."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Icon name="search" size={18} />

          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por projeto ou aluno"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={scope}
          onChange={(event) => {
            setScope(event.target.value);
            setPage(1);
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          {(isMentorRole(role) || role === "Aluno") && (
            <option value="mine">Meus projetos</option>
          )}
          {!isMentorRole(role) && role !== "Aluno" && (
            <option value="all">Todos os projetos</option>
          )}
        </select>

        <select
          value={course}
          onChange={(event) => {
            setCourse(event.target.value);
            setPage(1);
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="all">Todos os cursos</option>
          <option>Ciências Biológicas</option>
          <option>Engenharia Ambiental</option>
          <option>Engenharia da Computação</option>
          <option>Engenharia Florestal</option>
          <option>Farmácia</option>
          <option>História</option>
        </select>

        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as "az" | "za");
            setPage(1);
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="az">Projeto: A–Z</option>
          <option value="za">Projeto: Z–A</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 py-6">
        <strong className="text-sm text-slate-700">Legenda:</strong>
        <Badge tone="success">Aprovado</Badge>
        <Badge tone="warning">Em análise ou ajustes</Badge>
        <Badge tone="orange">Pendente</Badge>
        <Badge tone="danger">Atrasado</Badge>
        <Badge>Não disponível</Badge>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="sticky left-0 bg-slate-50 px-4 py-3">
                  Projeto / aluno
                </th>

                {Array.from({ length: 6 }, (_, index) => (
                  <th key={index} className="px-3 py-3 text-center">
                    M{index + 1}
                  </th>
                ))}

                <th className="px-3 py-3 text-center">Parcial</th>

                {Array.from({ length: 6 }, (_, index) => (
                  <th key={index + 6} className="px-3 py-3 text-center">
                    M{index + 7}
                  </th>
                ))}

                <th className="px-3 py-3 text-center">Final</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageProjects.map((projectItem, rowIndex) => {
                const statuses =
                  projectItem.progress === 100
                    ? Array(14).fill("success")
                    : matrixStatuses[rowIndex % matrixStatuses.length];

                const orderedStatuses = [
                  ...statuses.slice(0, 6),
                  statuses[12],
                  ...statuses.slice(6, 12),
                  statuses[13],
                ];

                return (
                  <tr
                    key={`${projectItem.id}-${projectItem.cycle}`}
                    onClick={() =>
                      navigate(`/projects/${projectItem.id}/reports`)
                    }
                    className="cursor-pointer transition hover:bg-indigo-50/50"
                  >
                    <td className="sticky left-0 bg-white px-4 py-4">
                      <strong className="block font-medium text-slate-800">
                        {projectItem.title}
                      </strong>

                      <small className="mt-1 block text-xs text-slate-500">
                        {projectItem.student} • {projectItem.course}
                      </small>
                    </td>

                    {orderedStatuses.map((status, index) => (
                      <td key={index} className="px-3 py-4 text-center">
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${
                            status === "success"
                              ? "bg-emerald-500"
                              : status === "warning"
                                ? "bg-amber-400"
                                : status === "orange"
                                  ? "bg-orange-500"
                                  : status === "danger"
                                    ? "bg-red-500"
                                    : "bg-slate-200"
                          }`}
                          title={statusLabels[status]}
                        >
                          <span className="sr-only">
                            {statusLabels[status]}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}

              {pageProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={15}
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
          total={visibleProjects.length}
          label="projetos"
          onPageChange={setPage}
        />
      </Card>
    </>
  );
}
