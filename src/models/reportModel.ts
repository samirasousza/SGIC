import type {
  ReportCell,
  ReportStatus,
  ReportType,
  ReviewDecision,
} from "../types/reportType";
import type { ProjectModel, ProjectPersonModel } from "./projectModel";
import type { GetAllProjectsParams } from "./projectModel";

export interface ReportVersionModel {
  versionNumber: number;
  fileName: string;
  fileSize: number;
  submittedAt: string;
  submittedLate: boolean;
  reviewDecision: ReviewDecision | null;
  reviewComment: string | null;
  reviewedBy: ProjectPersonModel | null;
  reviewedAt: string | null;
}

export interface ReportModel {
  id: string;
  type: ReportType;
  referenceMonth: number | null;
  calendarMonth: string | null;
  dueDate: string | null;
  status: ReportStatus;
  cell: ReportCell;
  acceptsFile: boolean;
  draft: { fileName: string; fileSize: number } | null;
  versions: ReportVersionModel[];
}

export interface ProjectReportsModel {
  projectId: string;
  canSubmit: boolean;
  canReview: boolean;
  canReopen: boolean;
  reports: ReportModel[];
}

export interface ReviewReportModel {
  decision: ReviewDecision;
  comment?: string | null;
}

export interface PendingReviewModel {
  reportId: string;
  projectId: string;
  sisprojNumber: string;
  projectTitle: string;
  student: ProjectPersonModel;
  type: ReportType;
  referenceMonth: number | null;
  status: ReportStatus;
  sentAt: string;
}

export interface ReportPanelModel {
  pendingMyReview: number;
  rows: Array<{
    project: ProjectModel;
    cells: Array<{
      reportId: string;
      type: ReportType;
      referenceMonth: number | null;
      cell: ReportCell;
    }>;
  }>;
}

export type GetReportsPanelParams = GetAllProjectsParams;
