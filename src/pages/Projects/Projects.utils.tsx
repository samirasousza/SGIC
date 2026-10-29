import type { Role } from "../Login/LoginTypes";

export function isAdvisorRole(role: Role) {
  return role === "Orientador" || role === "Orientador e avaliador" || role === "Comitê local";
}

export function isMentorRole(role: Role) {
  return isAdvisorRole(role) || role === "Coorientador";
}

export function advisorName(role: Role) {
  if (role === "Orientador" || role === "Orientador e avaliador")
    return "Ricardo Costa";
  if (role === "Comitê local") return "Marcela";
  if (role === "Coorientador") return "JB";
  return "Ricardo Costa";
}

export function advisorNameForAccount(role: Role, accountRole: Role) {
  if (
    accountRole === "Orientador e avaliador" ||
    accountRole === "Comitê local"
  )
    return advisorName(accountRole);
  return advisorName(role);
}
