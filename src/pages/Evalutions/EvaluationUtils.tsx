import type { Role } from "../Login/LoginTypes";
import { isAdvisorRole } from "../Projects/Projects.utils";

export function evaluationTitle(role: Role) {
  if (role === "Aluno") return "Autoavaliação do aluno";
  if (isAdvisorRole(role)) return "Avaliação do orientador";
  if (role === "Avaliador") return "Ficha do avaliador";
  return "Validação do comitê";
}

