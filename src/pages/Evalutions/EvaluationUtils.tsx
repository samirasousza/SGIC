import type { UserRole } from "../../types/userRoleType";
import { isAdvisorRole } from "../Projects/Projects.utils";

export function evaluationTitle(role: UserRole) {
  if (role === "STUDENT") return "Autoavaliação do aluno";
  if (isAdvisorRole(role)) return "Avaliação do orientador";
  if (role === "EVALUATOR") return "Ficha do avaliador";
  return "Validação do comitê";
}

