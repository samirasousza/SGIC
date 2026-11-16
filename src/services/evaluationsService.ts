import { api } from "../config/apiConfig";
import type {
  EvaluationFormModel,
  EvaluationPanelModel,
  FinalGradesModel,
  JustificationModel,
  ProjectEvaluationsModel,
  SaveEvaluationModel,
  SetHonorableMentionModel,
  SignEvaluationModel,
} from "../models/evaluationModel";
import type { GetAllProjectsParams } from "../models/projectModel";
import type { DefenseType } from "../types/defenseType";

const API_URL_EVALUATIONS = "/evaluations";
const API_URL_PROJECTS = "/projects";

export const GetEvaluationFormMine = async (
  projectId: string,
  defenseType: DefenseType,
): Promise<EvaluationFormModel> =>
  (
    await api.get<EvaluationFormModel>(
      `${API_URL_PROJECTS}/${projectId}/evaluations/${defenseType}/mine`,
    )
  ).data;

export const SaveEvaluationForm = async (
  projectId: string,
  defenseType: DefenseType,
  data: SaveEvaluationModel,
): Promise<EvaluationFormModel> =>
  (
    await api.put<EvaluationFormModel>(
      `${API_URL_PROJECTS}/${projectId}/evaluations/${defenseType}/mine`,
      data,
    )
  ).data;

export const PutHonorableMention = async (
  data: SetHonorableMentionModel,
): Promise<FinalGradesModel> =>
  (
    await api.put<FinalGradesModel>(
      `${API_URL_EVALUATIONS}/honorable-mentions`,
      data,
    )
  ).data;

export const SignAndSaveEvaluationForm = async (
  projectId: string,
  defenseType: DefenseType,
  data: SignEvaluationModel,
): Promise<EvaluationFormModel> =>
  (
    await api.post<EvaluationFormModel>(
      `${API_URL_PROJECTS}/${projectId}/evaluations/${defenseType}/mine/sign`,
      data,
    )
  ).data;

export const ReopenEvaluationForm = async (
  id: string,
  data: JustificationModel,
): Promise<EvaluationFormModel> =>
  (
    await api.post<EvaluationFormModel>(
      `${API_URL_EVALUATIONS}/${id}/reopen`,
      data,
    )
  ).data;

export const GetEvaluationFormSituation = async (
  projectId: string,
): Promise<ProjectEvaluationsModel> =>
  (
    await api.get<ProjectEvaluationsModel>(
      `${API_URL_PROJECTS}/${projectId}/evaluations`,
    )
  ).data;

export const GetEvaluationFormById = async (
  id: string,
): Promise<EvaluationFormModel> =>
  (await api.get<EvaluationFormModel>(`${API_URL_EVALUATIONS}/${id}`)).data;

export const DownloadEvaluationForm = async (id: string): Promise<Blob> =>
  (
    await api.get<Blob>(`${API_URL_EVALUATIONS}/${id}/pdf`, {
      responseType: "blob",
    })
  ).data;

export const GetEvaluationsPanel = async (
  params?: GetAllProjectsParams,
): Promise<EvaluationPanelModel> =>
  (
    await api.get<EvaluationPanelModel>(`${API_URL_EVALUATIONS}/panel`, {
      params,
    })
  ).data;

export const GetEvaluationsFinalGrades = async (
  cycle: string,
  unitId?: string,
): Promise<FinalGradesModel> =>
  (
    await api.get<FinalGradesModel>(`${API_URL_EVALUATIONS}/final-grades`, {
      params: { cycle, unitId },
    })
  ).data;
