import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { UserModel } from "../../models/userModel";
import { getAllUsers } from "../../services/userService";

import { UserTable } from "../../components/Users/UserTable";
import { UserFilters } from "../../components/Users/UserFilters";
import type { UserFiltersState } from "../../components/Users/UserFilters";
import { ListPagination } from "../../components/ListPagination";
import { Icon } from "../../components/Icon";
import { PendingUsersPage } from "./PedingUsers";
import { getAllUserRequests } from "../../services/userRequestssService";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";

const PAGE_SIZE = 10;

export function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserModel[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "pending">("users");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getAllUserRequests(["PENDING"])
      .then((d) => setPendingCount(d.length))
      .catch(() => undefined);
  }, []);

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
          <Breadcrumbs
            items={[
              { label: "Início", onClick: () => navigate("/") },
              { label: "Usuários" },
            ]}
          />

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Usuários e permissões
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gerencie acessos, perfis e vínculos institucionais.
          </p>
        </div>

        <Button onClick={() => navigate("/user-add")}>
          + Adicionar usuário
        </Button>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "users"
                ? "border-[#143c54] text-[#143c54]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon name="users" size={17} />
            Usuários cadastrados
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
              {total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "pending"
                ? "border-[#143c54] text-[#143c54]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon name="clock" size={17} />
            Cadastros pendentes
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                pendingCount
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {pendingCount}
            </span>
          </button>
        </div>
        <div className="mb-5">
          <p className="text-sm text-slate-500">
            {activeTab === "users" ? total : pendingCount} usuários encontrados
          </p>
        </div>

        {activeTab === "users" ? (
          <div>
            <UserFilters filters={filters} onChange={handleFilterChange} />

            {error && (
              <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            {loading ? (
              <p className="py-10 text-center text-sm text-slate-500">
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
          </div>
        ) : (
          <PendingUsersPage onCountChange={setPendingCount} />
        )}
      </section>
    </div>
  );
}
