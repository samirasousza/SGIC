import { api } from "../config/apiConfig";
import type {
  ProjectBoardMemberModel,
  RegisterProjectBoardModel,
} from "../models/projectBoardModel";
import type {
  GetAllProjectsParams,
  ProjectDetailsModel,
  ProjectFilterOptionsModel,
  ProjectModel,
} from "../models/projectModel";
import type { DefenseType } from "../types/defenseType";

const API_URL_PROJECTS = `/projects`;
const API_URL_PROJECTS_FILTER = `/projects/filter-options`;

export const GetAllProjects = async (
  params?: GetAllProjectsParams,
): Promise<ProjectModel[]> => {
  return (await api.get<ProjectModel[]>(API_URL_PROJECTS, { params })).data;
};

export const GetProjectDetails = async (
  id: string,
): Promise<ProjectDetailsModel> => {
  return (await api.get<ProjectDetailsModel>(`${API_URL_PROJECTS}/${id}`)).data;
};

export const GetProjectBoard = async (
  id: string,
): Promise<ProjectBoardMemberModel[]> => {
  return (
    await api.get<ProjectBoardMemberModel[]>(`${API_URL_PROJECTS}/${id}/board`)
  ).data;
};

export const RegisterProjectBoard = async (
  id: string,
  defenseType: DefenseType,
  evaluators: RegisterProjectBoardModel,
): Promise<ProjectBoardMemberModel[]> => {
  return (
    await api.put<ProjectBoardMemberModel[]>(
      `${API_URL_PROJECTS}/${id}/board/${defenseType}`,
      evaluators,
    )
  ).data;
};

export const GetProjectFilterOptions = async (
  cycle?: string,
): Promise<ProjectFilterOptionsModel> => {
  return (
    await api.get<ProjectFilterOptionsModel>(API_URL_PROJECTS_FILTER, {
      params: { cycle },
    })
  ).data;
};
