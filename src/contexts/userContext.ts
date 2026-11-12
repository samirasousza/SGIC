
import {
  createContext,
  useContext,
} from "react";

import type { ReactNode } from "react";
import type { UserRole } from "../types/userRoleType";
import type { UserModel } from "../models/userModel";

type RegisterData = {
  cpf: string;
  courseId: string;
  phone: string;
  pcd: boolean;
  hasDegree: boolean;
};

export interface UserContextData {
  user: UserModel | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  refreshUser: () => Promise<UserModel | null>;
  completeProfile: (data: RegisterData) => Promise<void>;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextData | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export type { UserProviderProps };

export function useUser(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de um <UserProvider>");
  }

  return context;
}
