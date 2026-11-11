
import { useState, type ReactNode } from "react";
import type { UserRole } from "../services/userService";
import { useUser } from "./userContext";
import { AppContext } from "./appContext";

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const [cycle, setCycle] = useState("2025/2026");
  const [roleState, setRoleState] = useState<UserRole | null>(null);

  const userRoles = user?.roles ?? [];

  const selectedRole =
    roleState && userRoles.includes(roleState)
      ? roleState
      : (userRoles[0] ?? null);

  function setSelectedRole(role: UserRole) {
    if (userRoles.includes(role)) {
      setRoleState(role);
    }
  }

  return (
    <AppContext.Provider
      value={{
        cycle,
        setCycle,
        selectedRole,
        setSelectedRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
