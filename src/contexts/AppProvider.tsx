import { useEffect, useState, type ReactNode } from "react";
import type { UserRole } from "../types/userRoleType";
import { useUser } from "./userContext";
import { AppContext } from "./appContext";
import { GetProjectFilterOptions } from "../services/projectService";

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const [cycle, setCycle] = useState("");
  const [cycles, setCycles] = useState<string[]>([]);
  const [cyclesLoading, setCyclesLoading] = useState(true);
  const [roleState, setRoleState] = useState<UserRole | null>(null);

  const userRoles = user?.roles ?? [];

  const selectedRole =
    roleState && userRoles.includes(roleState)
      ? roleState
      : (userRoles[0] ?? null);

  // Carrega os ciclos quando o usuário estiver autenticado
  // e define o mais recente (o back devolve do mais novo ao mais antigo).
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    GetProjectFilterOptions()
      .then((data) => {
        if (cancelled) return;
        setCycles(data.cycles);
        setCycle((current) =>
          current && (current === "all" || data.cycles.includes(current))
            ? current
            : (data.cycles[0] ?? "all"),
        );
      })
      .catch(() => {
        if (!cancelled) setCycle((current) => current || "all");
      })
      .finally(() => {
        if (!cancelled) setCyclesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  function setSelectedRole(role: UserRole | null) {
    if (role === null) {
      setRoleState(null);
      return;
    }
    if (userRoles.includes(role)) {
      setRoleState(role);
    }
  }

  return (
    <AppContext.Provider
      value={{
        cycle,
        setCycle,
        cycles,
        cyclesLoading,
        selectedRole,
        setSelectedRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
