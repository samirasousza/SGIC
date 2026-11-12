import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { UserModel } from "../../models/userModel";
import { getAllUsers } from "../../services/userService";

import { UserTable } from "../../components/Users/UserTable";
import { UserFilters } from "../../components/Users/UserFilters";
import type { UserFiltersState } from "../../components/Users/UserFilters";
import { ListPagination } from "../../components/ListPagination";
import type { PendingUser } from "../../components/Users/PendingUserCard";
import { Icon } from "../../components/Icon";
import { PendingUsersPage } from "./PedingUsers";

const PAGE_SIZE = 10;

export function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserModel[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "pending">("users");
  const [pendingRequests, setPendingRequests] = useState<PendingUser[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<UserFiltersState>({
    query: "",
    profile: "all",
    access: "all",
    sort: "asc",
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await getAllUsers({
          q: filters.query || undefined,
          page: page - 1,
          size: PAGE_SIZE,
          sort: [`name,${filters.sort}`],
        });

        let result = response.content;

        if (filters.profile !== "all") {
          result = result.filter((user) =>
            user.roles.includes(filters.profile as UserModel["roles"][number]),
          );
        }

        if (filters.access !== "all") {
          result = result.filter((user) =>
            filters.access === "active" ? user.active : !user.active,
          );
        }

        if (!cancelled) {
          setUsers(result);
          setTotal(response.page.totalElements);
        }
      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar os usuários.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  function handleFilterChange(next: UserFiltersState) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-700">Administração</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Usuários e permissões
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gerencie acessos, perfis e vínculos institucionais.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/user-add")}
          className="cursor-pointer rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
        >
          + Adicionar usuário
        </button>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`cursor-pointer flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "users"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon name="users" size={17} />
            Usuários cadastrados
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              {total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`cursor-pointer flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "pending"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon name="clock" size={17} />
            Cadastros pendentes
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                pendingRequests.length
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {pendingRequests.length}
            </span>
          </button>
        </div>
        <div className="mb-5">
          <p className="text-sm text-gray-500">{total} usuários encontrados</p>
        </div>

        {activeTab === "users" ? (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <UserFilters filters={filters} onChange={handleFilterChange} />

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {loading ? (
              <p className="py-10 text-center text-sm text-gray-500">
                Carregando usuários...
              </p>
            ) : (
              <>
                <div className="mt-5">
                  <UserTable
                    users={users}
                    onEdit={(user) => navigate(`/user-edit/${user.id}`)}
                  />
                </div>

                <div className="mt-5">
                  <ListPagination
                    page={page}
                    pageSize={PAGE_SIZE}
                    total={total}
                    label="usuários"
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </section>
        ) : (
          <PendingUsersPage />
        )}
      </section>
    </div>
  );
}
