import { api } from "../config/apiConfig";
import type {
  PendingReviewModel,
  ProjectReportsModel,
  ReportModel,
  ReportPanelModel,
  ReviewReportModel,
  GetReportsPanelParams,
} from "../models/reportModel";
import type { JustificationModel } from "../models/evaluationModel";

const API_URL_REPORTS = "/reports";
const API_URL_PROJECTS = "/projects";

export const PutReportDraft = async (
  id: string,
  file: File,
): Promise<ReportModel> => {
  const formData = new FormData();
  formData.append("file", file);
  return (
    await api.put<ReportModel>(`${API_URL_REPORTS}/${id}/draft`, formData)
  ).data;
};

export const DeleteReportDraft = async (id: string): Promise<ReportModel> =>
  (await api.delete<ReportModel>(`${API_URL_REPORTS}/${id}/draft`)).data;

export const SubmitReport = async (id: string): Promise<ReportModel> =>
  (await api.post<ReportModel>(`${API_URL_REPORTS}/${id}/submit`)).data;

export const ReviewReport = async (
  id: string,
  data: ReviewReportModel,
): Promise<ReportModel> =>
  (await api.post<ReportModel>(`${API_URL_REPORTS}/${id}/review`, data)).data;

export const ReopenReport = async (
  id: string,
  data: JustificationModel,
): Promise<ReportModel> =>
  (await api.post<ReportModel>(`${API_URL_REPORTS}/${id}/reopen`, data)).data;

export const DownloadReport = async (
  id: string,
  versionNumber: number,
): Promise<Blob> =>
  (
    await api.get<Blob>(
      `${API_URL_REPORTS}/${id}/versions/${versionNumber}/file`,
      { responseType: "blob" },
    )
  ).data;

export const DownloadReportDraft = async (id: string): Promise<Blob> =>
  (
    await api.get<Blob>(`${API_URL_REPORTS}/${id}/draft/file`, {
      responseType: "blob",
    })
  ).data;

export const DownloadReportTemplate = async (): Promise<Blob> =>
  (
    await api.get<Blob>(`${API_URL_REPORTS}/template`, {
      responseType: "blob",
    })
  ).data;

export const GetPendingReports = async (): Promise<PendingReviewModel[]> =>
  (await api.get<PendingReviewModel[]>(`${API_URL_REPORTS}/pending-review`))
    .data;

export const GetReportsPanel = async (
  params?: GetReportsPanelParams,
): Promise<ReportPanelModel> =>
  (await api.get<ReportPanelModel>(`${API_URL_REPORTS}/panel`, { params }))
    .data;

export const GetReportsProject = async (
  projectId: string,
): Promise<ProjectReportsModel> =>
  (
    await api.get<ProjectReportsModel>(
      `${API_URL_PROJECTS}/${projectId}/reports`,
    )
  ).data;
