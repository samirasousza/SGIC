import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { navOptions, profileName, type Role } from "../pages/Login/LoginTypes";

import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ProfileModal } from "./ProfileModal";

interface SidebarProps {
  accountRole: Role;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  logout: () => void;
}

export function Sidebar({
  accountRole,
  mobileOpen,
  setMobileOpen,
  logout,
}: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const name = profileName(accountRole);
  const navigate = useNavigate();
  const location = useLocation();

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {mobileOpen && (
        <button
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
            {navOptions.map((item) => {
              const active = location.pathname === `/${item.screen}`;

              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => {
                    navigate(item.screen ? `/${item.screen}` : "/");
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
          <div
            className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-3"
            onClick={() => setProfileOpen(true)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {name}
              </p>
              <p className="truncate text-xs text-slate-500">
                Perfil principal: {accountRole}
              </p>
            </div>
          </div>

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

      {profileOpen && (
        <ProfileModal role={accountRole} close={() => setProfileOpen(false)} />
      )}
    </>
  );
}
