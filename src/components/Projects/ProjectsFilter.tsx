import { Card } from "../Card";
import { Icon } from "../Icon";
import { scholarshipOptions } from "../../utils/translateScholarship";
import type { ProjectFilterOptionsModel } from "../../models/projectModel";

export interface ProjectFiltersValue {
  query: string;
  studentCourseId: string;
  advisorCourseId: string;
  scholarship: string;
  program: string;
  status: string;
  sort: string;
}

export const initialProjectFilters: ProjectFiltersValue = {
  query: "",
  studentCourseId: "all",
  advisorCourseId: "all",
  scholarship: "all",
  program: "all",
  status: "all",
  sort: "default",
};

const inputClass =
  "cursor-pointer w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const programLabels: Record<string, string> = {
  PAIC: "PAIC",
  PIBIC: "PIBIC",
  PIBIC_AF: "PIBIC AF",
  PIBITI: "PIBITI",
  PBICT_AF: "PBICT AF",
  VOLUNTEER: "Voluntário",
};

interface ProjectFilterProps {
  filters: ProjectFiltersValue;
  options: ProjectFilterOptionsModel | null;
  total: number;
  onChange: <K extends keyof ProjectFiltersValue>(
    field: K,
    value: ProjectFiltersValue[K],
  ) => void;
  onReset: () => void;
}

export function ProjectFilter({
  filters,
  options,
  total,
  onChange,
  onReset,
}: ProjectFilterProps) {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Buscar e filtrar projetos
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Busca</span>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={18} />
            </div>
            <input
              value={filters.query}
              onChange={(e) => onChange("query", e.target.value)}
              placeholder="Projeto, aluno, orientador ou SISPROJ"
              className={`${inputClass} cursor-text pl-10`}
            />
          </div>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">
            Curso do aluno
          </span>
          <select
            value={filters.studentCourseId}
            onChange={(e) => onChange("studentCourseId", e.target.value)}
            className={inputClass}
          >
            <option value="all">Todos os cursos</option>
            {options?.studentCourses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">
            Curso do orientador
          </span>
          <select
            value={filters.advisorCourseId}
            onChange={(e) => onChange("advisorCourseId", e.target.value)}
            className={inputClass}
          >
            <option value="all">Todos os cursos</option>
            {options?.advisorCourses.map((item) => (
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
            value={filters.scholarship}
            onChange={(e) => onChange("scholarship", e.target.value)}
            className={inputClass}
          >
            <option value="all">Todos os tipos</option>
            {scholarshipOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Programa</span>
          <select
            value={filters.program}
            onChange={(e) => onChange("program", e.target.value)}
            className={inputClass}
          >
            <option value="all">Todos os programas</option>
            {options?.programs.map((item) => (
              <option key={item} value={item}>
                {programLabels[item] ?? item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Situação</span>
          <select
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
            className={inputClass}
          >
            <option value="all">Todas as situações</option>
            <option value="UP_TO_DATE">Em dia</option>
            <option value="PENDING">Pendente</option>
            <option value="LATE">Atrasado</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">
            Ordenar por
          </span>
          <select
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
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
          {total} {total === 1 ? "projeto encontrado" : "projetos encontrados"}
        </p>

        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
        >
          <Icon name="close" size={16} />
          Limpar filtros
        </button>
      </div>
    </Card>
  );
}