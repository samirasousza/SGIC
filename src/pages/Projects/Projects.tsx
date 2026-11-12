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

const pageSize = 10;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

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

const scholarshipLabels: Record<string, string> = {
  SCHOLARSHIP_HOLDER: "Bolsista",
  VOLUNTEER: "Voluntário",
};

const programLabels: Record<string, string> = {
  PAIC: "PAIC",
  PIBIC: "PIBIC",
  PIBIC_AF: "PIBIC AF",
  PIBITI: "PIBITI",
  PBICT_AF: "PBICT AF",
  VOLUNTEER: "Voluntário",
};

export function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [filterOptions, setFilterOptions] =
    useState<ProjectFilterOptionsModel | null>(null);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [scholarship, setScholarship] = useState("all");
  const [program, setProgram] = useState("all");
  const [status, setStatus] = useState("all");
  const [cycle, setCycle] = useState("all");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Busca as opções de filtros
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const data = await GetProjectFilterOptions(
          cycle === "all" ? undefined : cycle,
        );

        setFilterOptions(data);
      } catch (error) {
        console.error("Erro ao carregar opções dos filtros:", error);
      }
    }

    loadFilterOptions();
  }, [cycle]);

  // Busca os projetos sempre que algum filtro mudar
  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const params: GetAllProjectsParams = {};

        if (cycle !== "all") params.cycle = cycle;
        if (query.trim()) params.q = query.trim();
        if (courseId !== "all") params.courseId = courseId;
        if (scholarship !== "all") {
          params.scholarshipType =
            scholarship as GetAllProjectsParams["scholarshipType"];
        }
        if (program !== "all") {
          params.program = program as GetAllProjectsParams["program"];
        }
        if (status !== "all") {
          params.situation = status as GetAllProjectsParams["situation"];
        }

        if (sort !== "default") {
          params.sort = "TITLE";
          params.direction = sort === "az" ? "ASC" : "DESC";
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
  }, [query, courseId, scholarship, program, status, cycle, sort]);

  function resetFilters() {
    setQuery("");
    setCourseId("all");
    setScholarship("all");
    setProgram("all");
    setStatus("all");
    setCycle("all");
    setSort("default");
    setPage(1);
  }

  function updateFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos" },
        ]}
      />

      <PageHeader
        title="Projetos"
        description="Consulte os projetos cadastrados, seus participantes, cursos, bolsas e situação atual."
      />

      <Card className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Buscar e filtrar projetos
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Utilize os filtros para encontrar os projetos desejados.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Busca</span>
            <div className="relative">
              <Icon name="search" size={18} />
              <input
                value={query}
                onChange={(event) => updateFilter(setQuery, event.target.value)}
                placeholder="Projeto, aluno, orientador ou SISPROJ"
                className={`${inputClass} pl-10`}
              />
            </div>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Curso</span>
            <select
              value={courseId}
              onChange={(event) =>
                updateFilter(setCourseId, event.target.value)
              }
              className={inputClass}
            >
              <option value="all">Todos os cursos</option>
              {filterOptions?.courses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Tipo de bolsa
            </span>
            <select
              value={scholarship}
              onChange={(event) =>
                updateFilter(setScholarship, event.target.value)
              }
              className={inputClass}
            >
              <option value="all">Todos os tipos</option>
              <option value="SCHOLARSHIP_HOLDER">Bolsista</option>
              <option value="VOLUNTEER">Voluntário</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Programa</span>
            <select
              value={program}
              onChange={(event) => updateFilter(setProgram, event.target.value)}
              className={inputClass}
            >
              <option value="all">Todos os programas</option>
              {filterOptions?.programs.map((item) => (
                <option key={item} value={item}>
                  {programLabels[item] ?? item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Situação</span>
            <select
              value={status}
              onChange={(event) => updateFilter(setStatus, event.target.value)}
              className={inputClass}
            >
              <option value="all">Todas as situações</option>
              <option value="UP_TO_DATE">Em dia</option>
              <option value="PENDING">Pendente</option>
              <option value="LATE">Atrasado</option>
            </select>
          </label>

          {/* <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Ciclo</span>
            <select
              value={cycle}
              onChange={(event) => updateFilter(setCycle, event.target.value)}
              className={inputClass}
            >
              <option value="all">Todos os ciclos</option>
              {filterOptions?.cycles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label> */}

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Ordenar por
            </span>
            <select
              value={sort}
              onChange={(event) => updateFilter(setSort, event.target.value)}
              className={inputClass}
            >
              <option value="default">Padrão</option>
              <option value="az">Título: A–Z</option>
              <option value="za">Título: Z–A</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            {projects.length}{" "}
            {projects.length === 1
              ? "projeto encontrado"
              : "projetos encontrados"}
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            <Icon name="close" size={16} />
            Limpar filtros
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-slate-900">Lista de projetos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Projetos cadastrados no sistema.
          </p>
        </div>

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

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {project.advisor.name}
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
