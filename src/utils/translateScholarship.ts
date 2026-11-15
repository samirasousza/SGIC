import type { ScholarshipType } from "../types/scholarshipType";

export const scholarshipLabels: Record<ScholarshipType, string> = {
  FAPEAM: "Bolsista FAPEAM",
  UEA: "Bolsista UEA",
  CNPQ: "Bolsista CNPq",
  VOLUNTEER: "Voluntário",
};

export const scholarshipOptions = Object.entries(scholarshipLabels) as [
  ScholarshipType,
  string,
][];