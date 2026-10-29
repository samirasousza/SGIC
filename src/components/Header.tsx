
import { useState } from "react";
import type { Role, Screen } from "../pages/Login/LoginTypes";
import { Icon } from "./Icon";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProfileModal } from "./ProfileModal";

interface HeaderProps {
  role: Role;
  accountRole: Role;
  setRole: (role: Role) => void;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  cycle: string;
  setCycle: (cycle: string) => void;
  setMobileOpen: (open: boolean) => void;
}

function isAdvisorRole(role: Role) {
  return role === "Orientador" || role === "Orientador e avaliador";
}

export function Header({
  role,
  accountRole,
  setRole,
  setScreen,
  cycle,
  setCycle,
  setMobileOpen,
}: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const availableViews: Role[] =
    accountRole === "Orientador e avaliador"
      ? ["Orientador", "Avaliador"]
      : accountRole === "Comitê local"
        ? ["Orientador", "Avaliador", "Comitê local"]
        : [accountRole];

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
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
              <option>2025–2026</option>
              <option>2024–2025</option>
              <option>2023–2024</option>
              {(isAdvisorRole(role) || role === "Apoio técnico") && (
                <option>Todos os ciclos</option>
              )}
            </select>
          </label>

          {availableViews.length > 1 && (
            <label className="hidden flex-col gap-1 md:flex">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Visualização
              </span>
              <select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value as Role);
                  setScreen("overview");
                }}
                className="max-w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {availableViews.map((view) => (
                  <option key={view} value={view}>
                    {view}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            type="button"
            aria-label="Notificações"
            onClick={() => setNotificationsOpen(true)}
            className="cursor-pointer relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            <Icon name="bell" size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <button
            type="button"
            aria-label="Abrir perfil"
            onClick={() => setProfileOpen(true)}
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Icon name="user" size={19} />
          </button>
        </div>
      </header>

      {notificationsOpen && (
        <NotificationsPanel
          close={() => setNotificationsOpen(false)}
          navigate={(next) => {
            setNotificationsOpen(false);
            setScreen(next);
          }}
        />
      )}

      {profileOpen && (
        <ProfileModal
          role={accountRole}
          close={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
