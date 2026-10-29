import { useState, type ReactNode } from "react";
import type { Role, Screen } from "../pages/Login/LoginTypes";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  role: Role;
  accountRole: Role;
  setRole: (role: Role) => void;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  cycle: string;
  setCycle: (cycle: string) => void;
  logout: () => void;
  children: ReactNode;
}

export function AppLayout({
  role,
  accountRole,
  setRole,
  screen,
  setScreen,
  cycle,
  setCycle,
  logout,
  children,
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        accountRole={accountRole}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        logout={logout}
      />

      <div className="min-h-screen lg:pl-72">
        <Header
          role={role}
          accountRole={accountRole}
          setRole={setRole}
          screen={screen}
          setScreen={setScreen}
          cycle={cycle}
          setCycle={setCycle}
          setMobileOpen={setMobileOpen}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
