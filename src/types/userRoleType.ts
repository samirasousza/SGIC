
export type UserRole =
  | "STUDENT"
  | "ADVISOR"
  // | "COADVISOR"
  | "EVALUATOR"
  | "LOCAL_COMMITTEE"
  | "TECHNICAL_SUPPORT"
  | "ADMIN";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: "Aluno",
  ADVISOR: "Orientador",
  // COADVISOR: "Coorientador",
  EVALUATOR: "Avaliador",
  LOCAL_COMMITTEE: "Comitê local",
  TECHNICAL_SUPPORT: "Apoio técnico",
  ADMIN: "Administrador",
};

export const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "STUDENT", label: "Aluno" },
  { value: "ADVISOR", label: "Orientador" },
  // { value: "COADVISOR", label: "Coorientador" },
  { value: "EVALUATOR", label: "Avaliador" },
  { value: "LOCAL_COMMITTEE", label: "Comitê local" },
  { value: "TECHNICAL_SUPPORT", label: "Apoio técnico" },
  { value: "ADMIN", label: "Administrador" },
];

export function toggleUserRole(
  profiles: UserRole[],
  role: UserRole,
): UserRole[] {
  const hasRole = profiles.includes(role);

  if (hasRole) {
    // Orientador não pode ser removido enquanto Comitê local estiver ativo.
    if (role === "ADVISOR" && profiles.includes("LOCAL_COMMITTEE")) {
      return profiles;
    }

    return profiles.filter((profile) => profile !== role);
  }

  // Perfis exclusivos.
  if (
    role === "STUDENT" ||
    role === "TECHNICAL_SUPPORT" ||
    role === "ADMIN"
  ) {
    return [role];
  }

  // Não permite combinar perfis exclusivos com outros.
  const exclusiveProfiles: UserRole[] = [
    "STUDENT",
    "TECHNICAL_SUPPORT",
    "ADMIN",
  ];

  if (profiles.some((profile) => exclusiveProfiles.includes(profile))) {
    return [role];
  }

  // Comitê local exige Orientador.
  if (role === "LOCAL_COMMITTEE") {
    return [...profiles, "ADVISOR", "LOCAL_COMMITTEE"];
  }

  return [...profiles, role];
}
