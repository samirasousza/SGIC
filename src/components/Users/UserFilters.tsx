import type { UserRole } from "../../types/userRoleType";
import { USER_ROLE_LABELS } from "../../types/userRoleType";
import { Icon } from "../Icon";

export interface UserFiltersState {
  query: string;
  profile: UserRole | "all";
  access: "all" | "active" | "inactive";
  sort: "asc" | "desc";
}

interface UserFiltersProps {
  filters: UserFiltersState;
  onChange: (filters: UserFiltersState) => void;
}

const controlClass =
  "min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#143c54] focus:ring-2 focus:ring-[#143c54]/10";

export function UserFilters({ filters, onChange }: UserFiltersProps) {
  function update<K extends keyof UserFiltersState>(key: K, value: UserFiltersState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name="search" size={17} />
        </span>
        <input
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          placeholder="Buscar usuário por nome ou e-mail"
          aria-label="Buscar usuário por nome ou e-mail"
          className={`${controlClass} pl-10`}
        />
      </div>
      <select aria-label="Filtrar por perfil" value={filters.profile} onChange={(e) => update("profile", e.target.value as UserRole | "all")} className={`${controlClass} cursor-pointer`}>
        <option value="all">Todos os perfis</option>
        {Object.entries(USER_ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <select aria-label="Filtrar por situação de acesso" value={filters.access} onChange={(e) => update("access", e.target.value as UserFiltersState["access"])} className={`${controlClass} cursor-pointer`}>
        <option value="all">Todos os acessos</option>
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
      </select>
      <select aria-label="Ordenar usuários" value={filters.sort} onChange={(e) => update("sort", e.target.value as UserFiltersState["sort"])} className={`${controlClass} cursor-pointer`}>
        <option value="asc">Nome: A–Z</option>
        <option value="desc">Nome: Z–A</option>
      </select>
    </div>
  );
}
