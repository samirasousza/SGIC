import type { UserRole } from "../../types/userRoleType";

export function isAdvisorRole(role: UserRole | null) {
  return role === "ADVISOR" || role === "LOCAL_COMMITTEE";
}

export function isMentorRole(role: UserRole | null) {
  return role === "ADVISOR";
  // || role === "COADVISOR";
}
