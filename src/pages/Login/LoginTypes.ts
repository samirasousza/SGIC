export type Role =
  | "Aluno"
  | "Orientador"
  | "Orientador e avaliador"
  | "Avaliador"
  | "Coorientador"
  | "Comitê local"
  | "Apoio técnico"
  | "Administrador";

export type Screen =
  | "overview"
  | "project"
  | "unit-projects"
  | "project-detail"
  | "board-project-detail"
  | "project-reports"
  | "project-evaluations"
  | "project-evaluators"
  | "reports"
  | "spreadsheets"
  | "boards"
  | "review-boards"
  | "board-evaluation"
  | "evaluation"
  | "users"
  | "user-add"
  | "user-edit"
  | "settings";


export const navByRole: Record<Role, { screen: Screen; label: string; icon: string }[]> = {
  Aluno: [
    { screen: "overview", label: "Visão geral", icon: "home" }, { screen: "project", label: "Meus projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file" },
  ],
  Orientador: [
    { screen: "overview", label: "Visão geral", icon: "home" }, { screen: "project", label: "Meus projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file" },
    { screen: "review-boards", label: "Avaliações", icon: "clipboard" },
  ],
  "Orientador e avaliador": [
    { screen: "overview", label: "Visão geral", icon: "home" }, { screen: "project", label: "Meus projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file" },
    { screen: "review-boards", label: "Avaliações", icon: "clipboard" },
  ],
  Coorientador: [
    { screen: "overview", label: "Visão geral", icon: "home" }, { screen: "project", label: "Meus projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file" },
  ],
  Avaliador: [
    { screen: "overview", label: "Visão geral", icon: "home" }, { screen: "boards", label: "Avaliações", icon: "clipboard" },
  ],
  "Comitê local": [
    { screen: "overview", label: "Visão geral", icon: "home" },
    { screen: "unit-projects", label: "Projetos da unidade", icon: "chart" },
    { screen: "reports", label: "Relatórios", icon: "file" },
    { screen: "review-boards", label: "Avaliações", icon: "clipboard" },
    { screen: "spreadsheets", label: "Planilhas", icon: "chart" },
  ],
  "Apoio técnico": [
    { screen: "overview", label: "Visão geral", icon: "home" },
    { screen: "unit-projects", label: "Projetos da unidade", icon: "chart" },
    { screen: "reports", label: "Relatórios", icon: "file" },
    { screen: "review-boards", label: "Avaliações", icon: "clipboard" },
    { screen: "spreadsheets", label: "Planilhas", icon: "chart" },
  ],
  Administrador: [
    { screen: "overview", label: "Visão geral", icon: "home" }, { screen: "project", label: "Projetos", icon: "folder" },
    { screen: "spreadsheets", label: "Planilhas", icon: "chart" },
    { screen: "users", label: "Usuários", icon: "users" }, { screen: "settings", label: "Configurações", icon: "settings" },
  ],
};

export function profileName(role: Role) {
  if (role === "Aluno") return "Samira";
  if (role === "Orientador") return "Professor orientador";
  if (role === "Orientador e avaliador") return "Professora orientadora";
  if (role === "Comitê local") return "Profa. Marcela";
  if (role === "Avaliador") return "Davi";
  if (role === "Coorientador") return "Prof. JB";
  return role;
}