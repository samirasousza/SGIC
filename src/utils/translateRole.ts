import { USER_ROLE_LABELS, type UserRole } from "../types/userRoleType";

export const translateRole = (role: UserRole): string => {
  return USER_ROLE_LABELS[role];
};
