import type { UserRole } from "../../types/userRoleType";
import { isAdvisorRole } from "../Projects/Projects.utils";

export function evaluationTitle(role: UserRole) {
  if (role === "STUDENT")
    return "Formulário de Avaliação do Orientador";

  if (isAdvisorRole(role)) return "Formulário de Avaliação do Aluno";

  if (role === "EVALUATOR") return "Formulário de Avaliação do Projeto";

  return "Formulário de Validação do Comitê";
}

export function evaluationDescription(role: UserRole) {
  if (role === "STUDENT") {
    return "Avalie a atuação do seu orientador ao longo das atividades de orientação.";
  }

  if (isAdvisorRole(role)) {
    return "Avalie o desempenho, a assiduidade e o comprometimento do aluno na execução das atividades e no desenvolvimento do projeto.";
  }

  if (role === "EVALUATOR") {
    return "Avalie o trabalho apresentado pelo aluno, considerando a qualidade do projeto, a apresentação, o domínio do conteúdo e o cumprimento do cronograma.";
  }

  return "Analise as informações e os registros da avaliação para realizar a validação do projeto.";
}
