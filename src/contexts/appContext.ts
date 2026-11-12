
import { createContext, useContext } from "react";
import type { UserRole } from "../types/userRoleType";

export interface AppContextData {
  cycle: string;
  setCycle: (cycle: string) => void;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
}

export const AppContext = createContext<AppContextData | undefined>(
  undefined,
);

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext deve ser utilizado dentro de AppProvider");
  }

  return context;
}
