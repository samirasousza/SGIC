import type { Screen } from "../types/screenType";
import type { UserRole } from "../types/userRoleType";

interface NavigationOption {
  screen: Screen;
  label: string;
  icon: string;
}

export const navigationByRole: Record<UserRole, NavigationOption[]> = {
  STUDENT: [
    { screen: "", label: "Início", icon: "home" },
    { screen: "projects", label: "Meus projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file-text" },
  ],

  ADVISOR: [
    { screen: "", label: "Início", icon: "home" },
    { screen: "projects", label: "Meus projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file-text" },
    { screen: "evaluations", label: "Avaliações", icon: "clipboard-check" },
    { screen: "evaluators", label: "Avaliadores", icon: "users" },
  ],

  // COADVISOR: [
  //   { screen: "", label: "Início", icon: "home" },
  //   { screen: "projects", label: "Meus projetos", icon: "folder" },
  //   { screen: "reports", label: "Relatórios", icon: "file-text" },
  //   { screen: "evaluations", label: "Avaliações", icon: "clipboard-check" },
  //   { screen: "evaluators", label: "Avaliadores", icon: "users" },
  // ],

  EVALUATOR: [
    { screen: "", label: "Início", icon: "home" },
    { screen: "evaluations", label: "Avaliações", icon: "clipboard-check" },
  ],

  LOCAL_COMMITTEE: [
    { screen: "", label: "Início", icon: "home" },
    { screen: "projects", label: "Projetos da unidade", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file-text" },
    { screen: "evaluations", label: "Avaliações", icon: "clipboard-check" },
    { screen: "evaluators", label: "Avaliadores", icon: "users" },
    { screen: "spreadsheets", label: "Planilhas", icon: "table" },
  ],

  TECHNICAL_SUPPORT: [
    { screen: "", label: "Início", icon: "home" },
    { screen: "projects", label: "Projetos da unidade", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file-text" },
    { screen: "evaluations", label: "Avaliações", icon: "clipboard-check" },
    { screen: "evaluators", label: "Avaliadores", icon: "users" },
    { screen: "spreadsheets", label: "Planilhas", icon: "table" },
  ],

  ADMIN: [
    { screen: "", label: "Início", icon: "home" },
    { screen: "projects", label: "Projetos", icon: "folder" },
    { screen: "reports", label: "Relatórios", icon: "file-text" },
    { screen: "evaluations", label: "Avaliações", icon: "clipboard-check" },
    { screen: "evaluators", label: "Avaliadores", icon: "users" },
    { screen: "spreadsheets", label: "Planilhas", icon: "table" },
    { screen: "users", label: "Usuários", icon: "users" },
    { screen: "settings", label: "Configurações", icon: "settings" },
  ],
};

export function getNavigationOptions(role: UserRole | null) {
  if (!role) return [];

  return navigationByRole[role] ?? [];
}

export function getScreenPath(screen: Screen): string {
  if (screen === "" || screen === "overview") return "/";
  if (screen === "projects" || screen === "unit-projects") return "/projects";

  return `/${screen}`;
}
