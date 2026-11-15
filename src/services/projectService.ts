import { api } from "../config/apiConfig";
import type {
  GetAllProjectsParams,
  ProjectDetailsModel,
  ProjectFilterOptionsModel,
  ProjectModel,
} from "../models/projectModel";

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

export const GetProjectFilterOptions = async (
  cycle?: string,
): Promise<ProjectFilterOptionsModel> => {
  return (
    await api.get<ProjectFilterOptionsModel>(API_URL_PROJECTS_FILTER, {
      params: { cycle },
    })
  ).data;
};
