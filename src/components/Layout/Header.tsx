import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileModal } from "../ProfileModal";
import { translateRole } from "../../utils/translateRole";
import { useUser } from "../../contexts/userContext";
import { useAppContext } from "../../contexts/appContext";
import type { UserRole } from "../../types/userRoleType";
import { Icon } from "../Icon";
import { GetUnreadNotificationsCount } from "../../services/notificationsService";
import { NotificationsPanel } from "../Notifications/NotificationsPanel";

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

function allowsAllCycles(role: UserRole | null) {
  return role === "ADVISOR" || role === "TECHNICAL_SUPPORT";
}

export function Header({ setMobileOpen }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const { user } = useUser();
  const { cycle, setCycle, cycles, selectedRole, setSelectedRole } =
    useAppContext();

  const availableViews = user?.roles ?? [];

  const refreshUnreadCount = useCallback(() => {
    GetUnreadNotificationsCount()
      .then((response) => setUnreadCount(response.unread ?? 0))
      .catch(() => setUnreadCount(0));
  }, []);

  function handleRoleChange(role: UserRole) {
    setSelectedRole(role);
    navigate("/");
  }

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  useEffect(() => {
    if (cycle === "all" && !allowsAllCycles(selectedRole) && cycles.length) {
      setCycle(cycles[0]);
    }
  }, [selectedRole, cycle, cycles, setCycle]);

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen(true)}
            className="cursor-pointer rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <Icon name="menu" size={22} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              Sistema de Gerenciamento de Iniciação Científica
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Universidade do Estado do Amazonas — UEA
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <label className="hidden flex-col gap-1 sm:flex">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Visão do ciclo
            </span>
            <select
              value={cycle}
              onChange={(event) => setCycle(event.target.value)}
              className="max-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {cycles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {allowsAllCycles(selectedRole) && (
                <option value="all">Todos os ciclos</option>
              )}
            </select>
          </label>

          {availableViews.length > 1 && (
            <label className="hidden flex-col gap-1 md:flex">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Visualização
              </span>
              <select
                value={selectedRole ?? ""}
                onChange={(event) =>
                  handleRoleChange(event.target.value as UserRole)
                }
                className="max-w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {availableViews.map((view) => (
                  <option key={view} value={view}>
                    {translateRole(view)}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            type="button"
            aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ""}`}
            onClick={() => setNotificationsOpen(true)}
            className="relative cursor-pointer rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            <Icon name="bell" size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Abrir perfil"
            onClick={() => setProfileOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Icon name="user" size={19} />
          </button>
        </div>
      </header>

      {notificationsOpen && (
        <NotificationsPanel
          close={() => setNotificationsOpen(false)}
          navigate={(path) => {
            setNotificationsOpen(false);
            navigate(path);
          }}
          onNotificationsChanged={refreshUnreadCount}
        />
      )}

      {profileOpen && <ProfileModal close={() => setProfileOpen(false)} />}
    </>
  );
}
