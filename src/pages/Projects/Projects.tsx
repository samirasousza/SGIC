import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { ListPagination } from "../../components/ListPagination";
import { PageHeader } from "../../components/PageHeader";
import { useNavigate } from "react-router";
import {
  GetAllProjects,
  GetProjectFilterOptions,
} from "../../services/projectService";
import type {
  GetAllProjectsParams,
  ProjectModel,
  ProjectFilterOptionsModel,
} from "../../models/projectModel";
import { scholarshipLabels } from "../../utils/translateScholarship";
import { useAppContext } from "../../contexts/appContext";
import { initialProjectFilters, ProjectFilter, type ProjectFiltersValue } from "../../components/Projects/ProjectsFilter";

const pageSize = 10;

const situationLabels: Record<string, string> = {
  UP_TO_DATE: "Em dia",
  PENDING: "Pendente",
  LATE: "Atrasado",
};

const statusStyles: Record<string, string> = {
  UP_TO_DATE: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-amber-50 text-amber-700",
  LATE: "bg-red-50 text-red-700",
};

export function ProjectsPage() {
  const navigate = useNavigate();
  const { cycle, cyclesLoading } = useAppContext();

  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [filterOptions, setFilterOptions] =
    useState<ProjectFilterOptionsModel | null>(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<ProjectFiltersValue>(
    initialProjectFilters,
  );

  function changeFilter<K extends keyof ProjectFiltersValue>(
    field: K,
    value: ProjectFiltersValue[K],
  ) {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialProjectFilters);
    setPage(1);
  }

  // Busca as opções de filtros
  useEffect(() => {
    if (cyclesLoading) return;

    async function loadFilterOptions() {
      try {
        const data = await GetProjectFilterOptions(
          cycle && cycle !== "all" ? cycle : undefined,
        );

        setFilterOptions(data);
      } catch (error) {
        console.error("Erro ao carregar opções dos filtros:", error);
      }
    }

    loadFilterOptions();
  }, [cycle, cyclesLoading]);

  // Busca os projetos sempre que algum filtro mudar
  useEffect(() => {
    let active = true;

    if (cyclesLoading) return;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const params: GetAllProjectsParams = {};

        if (cycle && cycle !== "all") params.cycle = cycle;
        if (filters.query.trim()) params.q = filters.query.trim();
        if (filters.studentCourseId !== "all")
          params.studentCourseId = filters.studentCourseId;
        if (filters.advisorCourseId !== "all")
          params.advisorCourseId = filters.advisorCourseId;
        if (filters.scholarship !== "all") {
          params.scholarshipType =
            filters.scholarship as GetAllProjectsParams["scholarshipType"];
        }
        if (filters.program !== "all") {
          params.program = filters.program as GetAllProjectsParams["program"];
        }
        if (filters.status !== "all") {
          params.situation =
            filters.status as GetAllProjectsParams["situation"];
        }
        if (filters.sort !== "default") {
          params.sort = "TITLE";
          params.direction = filters.sort === "az" ? "ASC" : "DESC";
        }

        const data = await GetAllProjects(params);

        if (active) {
          setProjects(data);
          setPage(1);
        }
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);

        if (active) {
          setError("Não foi possível carregar os projetos. Tente novamente.");
          setProjects([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, [filters, cycle, cyclesLoading]);

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos" },
        ]}
      />

      <PageHeader
        title="Projetos"
      />

      <ProjectFilter
        filters={filters}
        options={filterOptions}
        total={projects.length}
        onChange={changeFilter}
        onReset={resetFilters}
      />

      <Card className="overflow-hidden p-0">

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Carregando projetos...
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-sm text-red-600">
            {error}
          </div>
        ) : pageProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-semibold">Projeto</th>
                  <th className="px-6 py-4 font-semibold">Aluno</th>
                  <th className="px-6 py-4 font-semibold">Orientador</th>
                  <th className="px-6 py-4 font-semibold">Bolsa</th>
                  <th className="px-6 py-4 font-semibold">Ciclo</th>
                  <th className="px-6 py-4 font-semibold">Situação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pageProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="cursor-pointer transition-colors hover:bg-slate-50"
                  >
                    <td className="max-w-xs px-6 py-4">
                      <p className="font-medium leading-5 text-slate-800">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {project.unit.acronym}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {project.student.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.studentCourse}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {project.advisor.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.advisorCourse ?? "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {scholarshipLabels[project.scholarshipType] ??
                          project.scholarshipType}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {project.cycle}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[project.situation] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {situationLabels[project.situation] ??
                          project.situation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon name="search" size={22} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-800">
              Nenhum projeto encontrado
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Não encontramos projetos com os filtros selecionados. Tente
              alterar a busca ou limpar os filtros.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Limpar filtros
            </button>
          </div>
        )}

        <div className="border-t border-slate-100 px-4 py-3 sm:px-6">
          <ListPagination
            page={currentPage}
            total={projects.length}
            label="projetos"
            onPageChange={setPage}
          />
        </div>
      </Card>
    </div>
  );
}
