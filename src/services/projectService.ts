import { api } from "../config/apiConfig";
import type {
  GetAllProjectsParams,
  ImportProjectsModel,
  ImportResultModel,
  ProjectDetailsModel,
  ProjectFilterOptionsModel,
  ProjectModel,
} from "../models/projectModel";

const API_URL_PROJECTS = "/projects";
const API_URL_PROJECTS_FILTER = "/projects/filter-options";

export const GetAllProjects = async (
  params?: GetAllProjectsParams,
): Promise<ProjectModel[]> =>
  (await api.get<ProjectModel[]>(API_URL_PROJECTS, { params })).data;

export const GetProjectDetails = async (
  id: string,
): Promise<ProjectDetailsModel> =>
  (await api.get<ProjectDetailsModel>(`${API_URL_PROJECTS}/${id}`)).data;

export const GetProjectFilterOptions = async (
  cycle?: string,
): Promise<ProjectFilterOptionsModel> =>
  (
    await api.get<ProjectFilterOptionsModel>(API_URL_PROJECTS_FILTER, {
      params: cycle ? { cycle } : undefined,
    })
  ).data;

export const ImportProjects = async (
  data: ImportProjectsModel,
): Promise<ImportResultModel> =>
  (
    await api.post<ImportResultModel>(`${API_URL_PROJECTS}/import`, data)
  ).data;
