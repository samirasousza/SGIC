export interface CycleModel {
  id: string;
  cycle: string;
  partialReportDueDate: string | null;
  finalReportDueDate: string | null;
  closesOn: string | null;
}

export interface RegisterCycleModel {
  cycle: string;
  partialReportDueDate?: string | null;
  finalReportDueDate?: string | null;
  closesOn?: string | null;
}

export interface UpdateCycleModel {
  partialReportDueDate?: string | null;
  finalReportDueDate?: string | null;
  closesOn?: string | null;
}
