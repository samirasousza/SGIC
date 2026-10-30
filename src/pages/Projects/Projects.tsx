import { useMemo, useState } from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { ListPagination } from "../../components/ListPagination";
import { PageHeader } from "../../components/PageHeader";
import { projectRows } from "./ProjectsData";
import { useNavigate } from "react-router";

const pageSize = 10;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const statusStyles: Record<string, string> = {
  "Em andamento": "bg-blue-50 text-blue-700",
  "Em avaliação": "bg-violet-50 text-violet-700",
  Concluído: "bg-emerald-50 text-emerald-700",
  Atenção: "bg-amber-50 text-amber-700",
};

export function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [scholarship, setScholarship] = useState("all");
  const [status, setStatus] = useState("all");
  const [cycle, setCycle] = useState("all");
  const [sort, setSort] = useState<"az" | "za">("az");

  const navigate = useNavigate();

  const courses = useMemo(
    () => [...new Set(projectRows.map((project) => project.course))].sort(),
    [],
  );

  const cycles = useMemo(
    () => [...new Set(projectRows.map((project) => project.cycle))].sort(),
    [],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return projectRows
      .filter((project) => {
        const matchesQuery =
          !normalizedQuery ||
          `${project.title} ${project.student} ${project.advisor} ${project.course}`
            .toLocaleLowerCase("pt-BR")
            .includes(normalizedQuery);

        const matchesCourse = course === "all" || project.course === course;

        const matchesScholarship =
          scholarship === "all" || project.scholarship === scholarship;

        const matchesStatus = status === "all" || project.status === status;

        const matchesCycle = cycle === "all" || project.cycle === cycle;

        return (
          matchesQuery &&
          matchesCourse &&
          matchesScholarship &&
          matchesStatus &&
          matchesCycle
        );
      })
      .slice()
      .sort((first, second) =>
        sort === "az"
          ? first.title.localeCompare(second.title, "pt-BR")
          : second.title.localeCompare(first.title, "pt-BR"),
      );
  }, [query, course, scholarship, status, cycle, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const pageProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetFilters() {
    setQuery("");
    setCourse("all");
    setScholarship("all");
    setStatus("all");
    setCycle("all");
    setSort("az");
    setPage(1);
  }

  function updateFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

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
                placeholder="Projeto, aluno ou orientador"
                className={`${inputClass} pl-10`}
              />
            </div>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Curso</span>
            <select
              value={course}
              onChange={(event) => updateFilter(setCourse, event.target.value)}
              className={inputClass}
            >
              <option value="all">Todos os cursos</option>
              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
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
              <option value="Voluntário">Voluntário</option>
              <option value="ICT">ICT</option>
              <option value="PAIC">PAIC</option>
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
              <option value="Em andamento">Em andamento</option>
              <option value="Em avaliação">Em avaliação</option>
              <option value="Concluído">Concluído</option>
              <option value="Atenção">Atenção</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Ciclo</span>
            <select
              value={cycle}
              onChange={(event) => updateFilter(setCycle, event.target.value)}
              className={inputClass}
            >
              <option value="all">Todos os ciclos</option>
              {cycles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Ordenar por
            </span>
            <select
              value={sort}
              onChange={(event) =>
                updateFilter(setSort, event.target.value as "az" | "za")
              }
              className={inputClass}
            >
              <option value="az">Nome: A–Z</option>
              <option value="za">Nome: Z–A</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1
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
            Dados de demonstração para o desenvolvimento do sistema.
          </p>
        </div>

        {pageProjects.length > 0 ? (
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
                        {project.unit}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {project.student}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.course}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {project.advisor}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {project.scholarship}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {project.cycle}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[project.status] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {project.status}
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
            total={filteredProjects.length}
            label="projetos"
            onPageChange={setPage}
          />
        </div>
      </Card>
    </div>
  );
}
