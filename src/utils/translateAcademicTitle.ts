import type { AcademicTitleType } from "../types/academicTitleType";

export const academicTitleLabels: Record<AcademicTitleType, string> = {
  BACHELOR: "Graduação",
  SPECIALIST: "Especialização",
  MASTER: "Mestrado",
  DOCTOR: "Doutorado",
  POST_DOCTOR: "Pós-doutorado",
};

export const academicTitleOptions = Object.entries(academicTitleLabels) as [
  AcademicTitleType,
  string,
][];
