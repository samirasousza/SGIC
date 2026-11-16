export type ReportType = "MONTHLY" | "PARTIAL" | "FINAL";
export type ReportStatus =
  | "NOT_SENT"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "RESUBMITTED"
  | "APPROVED";
export type ReportCell =
  | "APPROVED"
  | "IN_REVIEW"
  | "CHANGES_REQUESTED"
  | "LATE"
  | "NOT_DUE";
export type ReportSituation = "UP_TO_DATE" | "PENDING" | "LATE";
export type ReviewDecision = "APPROVED" | "CHANGES_REQUESTED";
