import type { UserRole } from "../types/userRoleType";

const TEACHER_ROLES: UserRole[] = ["ADVISOR", "EVALUATOR", "LOCAL_COMMITTEE"];
const NO_COURSE_ROLES: UserRole[] = ["ADMIN", "TECHNICAL_SUPPORT"];

/** Quais campos do usuário fazem sentido para cada conjunto de perfis. */
export function getUserFieldVisibility(roles: UserRole[] = []) {
  return {
    // PcD e graduação: somente alunos
    showStudentFields: roles.includes("STUDENT"),
    // Titulação e instituição: somente professores
    showTeacherFields: roles.some((role) => TEACHER_ROLES.includes(role)),
    // Admin e apoio técnico não têm curso nem unidade
    showCourse: !roles.some((role) => NO_COURSE_ROLES.includes(role)),
  };
}
