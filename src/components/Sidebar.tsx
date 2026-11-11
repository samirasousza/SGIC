import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { navOptions } from "../pages/Login/LoginTypes";

import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ProfileModal } from "./ProfileModal";
import { useUser } from "../contexts/userContext";
import { translateRole } from "../utils/translateRole";
import type { UserRole } from "../services/userService";
import { useAppContext } from "../contexts/appContext";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  logout: () => void;
}

const rolePermissions: Record<UserRole, string[]> = {
  STUDENT: ["", "project", "reports"],

  ADVISOR: ["", "project", "reports", "evaluations", "evaluators"],

  LOCAL_COMMITTEE: [
    "",
    "project",
    "reports",
    "evaluations",
    "evaluators",
    "spreadsheets",
  ],

  EVALUATOR: ["evaluations"],

  TECHNICAL_SUPPORT: [
    "",
    "project",
    "reports",
    "evaluations",
    "evaluators",
    "spreadsheets",
  ],

  ADMIN: [
    "",
    "project",
    "reports",
    "evaluations",
    "evaluators",
    "spreadsheets",
    "users",
  ],
};

export function Sidebar({ mobileOpen, setMobileOpen, logout }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUser();

  const userRoles = user?.roles ?? [];

  const { selectedRole } = useAppContext();

  const allowedScreens = selectedRole ? rolePermissions[selectedRole] : [];

  const visibleOptions = navOptions.filter((item) =>
    allowedScreens.includes(item.screen),
  );

  // Reúne as permissões de todas as funções do usuário.
  // const allowedScreens = new Set(
  //   userRoles.flatMap((role) => rolePermissions[role]),
  // );

  // Comitê local e administrador acessam projetos da unidade.
  // const hasUnitProjectAccess = userRoles.some(
  //   (role) =>
  //     role === "LOCAL_COMMITTEE" ||
  //     role === "TECHNICAL_SUPPORT" ||
  //     role === "ADMIN",
  // );

  // const visibleOptions = navOptions
  //   .filter((item) => allowedScreens.has(item.screen))
  //   .map((item) => ({
  //     ...item,
  //     label:
  //       item.screen === "project"
  //         ? hasUnitProjectAccess
  //           ? "Projetos da unidade"
  //           : "Meus projetos"
  //         : item.label,
  //   }));

  function initialsName(name?: string): string {
    if (!name) return "";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Logo />

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navegação
          </p>

          <div className="space-y-1">
            {visibleOptions.map((item) => {
              const path = item.screen ? `/${item.screen}` : "/";

              const active =
                location.pathname === path ||
                (item.screen !== "" &&
                  location.pathname.startsWith(`${path}/`));

              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => {
                    navigate(path);
                    setMobileOpen(false);
                  }}
                  className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon name={item.icon} size={19} />

                  <span className="flex-1">{item.label}</span>

                  {active && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="mb-4 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-3 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {initialsName(user?.name)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name ?? "Usuário"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {selectedRole
                  ? translateRole(selectedRole)
                  : "Sem função vinculada"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Icon name="logout" size={18} />
            Sair do sistema
          </button>
        </div>
      </aside>

      {profileOpen && <ProfileModal close={() => setProfileOpen(false)} />}
    </>
  );
}
