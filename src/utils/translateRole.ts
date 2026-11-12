import type { UserRole } from "../services/loggedUserService";

export const translateRole = (role: UserRole): string => {
  const roles: Record<UserRole, string> = {
    STUDENT: "Aluno",
    ADVISOR: "Orientador",
    EVALUATOR: "Avaliador",
    LOCAL_COMMITTEE: "Comitê local",
    TECHNICAL_SUPPORT: "Apoio técnico",
    ADMIN: "Administrador",
  };

  return roles[role];
};
