import { useCallback, useEffect, useMemo, useState } from "react";

import {
  registerStudentInfo,
  userData
} from "../services/userService";

import {
  UserContext,
  type UserContextData,
  type UserProviderProps,
} from "./userContext";
import type { UserModel } from "../models/userModel";
import type { UserRole } from "../types/userRoleType";

type RegisterData = Parameters<typeof registerStudentInfo>[0];

function hasToken(): boolean {
  return !!localStorage.getItem("authToken");
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(hasToken);

  const refreshUser = useCallback(async (): Promise<UserModel | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await userData();

      setUser(data);
      return data;
    } catch {
      setUser(null);
      setError("Não foi possível carregar os dados do usuário.");

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeProfile = useCallback(
    async (data: RegisterData): Promise<void> => {
      await registerStudentInfo(data);
      await refreshUser();
    },
    [refreshUser],
  );

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.roles?.includes(role) ?? false;
    },
    [user],
  );

  // Carregamento inicial do usuário.
  useEffect(() => {
    if (!hasToken()) return;

    let cancelled = false;

    async function loadUser() {
      try {
        const data = await userData();

        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setError("Não foi possível carregar os dados do usuário.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<UserContextData>(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user,
      hasRole,
      refreshUser,
      completeProfile,
      clearUser,
    }),
    [user, loading, error, hasRole, refreshUser, completeProfile, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
