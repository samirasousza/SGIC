
import type { UserRole } from "../../types/userRoleType";
import { USER_ROLE_LABELS } from "../../types/userRoleType";

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

export function UserFilters({ filters, onChange }: UserFiltersProps) {
  function update<K extends keyof UserFiltersState>(
    key: K,
    value: UserFiltersState[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative">
        <input
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          placeholder="Buscar usuário por nome ou e-mail"
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">⌕</span>
      </div>

      <select
        value={filters.profile}
        onChange={(e) =>
          update("profile", e.target.value as UserRole | "all")
        }
        className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
      >
        <option value="all">Todos os perfis</option>
        {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={filters.access}
        onChange={(e) =>
          update("access", e.target.value as UserFiltersState["access"])
        }
        className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
      >
        <option value="all">Todos os acessos</option>
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
      </select>

      <select
        value={filters.sort}
        onChange={(e) =>
          update("sort", e.target.value as UserFiltersState["sort"])
        }
        className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
      >
        <option value="asc">Nome: A–Z</option>
        <option value="desc">Nome: Z–A</option>
      </select>
    </div>
  );
}
