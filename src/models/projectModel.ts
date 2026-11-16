import type { AcademicTitleType } from "../types/academicTitleType";
import type { ProjectProgram } from "../types/projectProgram";
import type { ProjectSituation } from "../types/projectSituation";
import type { ProjectSort } from "../types/projectSort";
import type { ScholarshipType } from "../types/scholarshipType";
import type { SortDirection } from "../types/sortDirection";
export interface ProjectPersonModel {
  id: string;
  name: string;
  email: string;
}

export interface UnitModel {
  id: string;
  name: string;
  acronym: string;
}

export interface CourseModel {
  id: string;
  name: string;
  unit: UnitModel;
}

export interface TeacherModel {
  id: string;
  name: string;
  email: string;
  course: CourseModel | null;
  academicTitle: AcademicTitleType | null;
  institution: string | null;
}

export interface ProjectModel {
  id: string;
  sisprojNumber: string;
  title: string;
  cycle: string;
  program: ProjectProgram;
  scholarshipType: ScholarshipType;
  unit: UnitModel;
  student: ProjectPersonModel;
  studentCourse: string | null;
  advisor: ProjectPersonModel;
  advisorCourse: string | null;
  startDate: string;
  endDate: string;
  situation: ProjectSituation;
}

export interface ProjectDetailsModel {
  id: string;
  sisprojNumber: string;
  title: string;
  summary: string;
  program: ProjectProgram;
  scholarshipType: ScholarshipType;
  noticeNumber: string | null;
  cycle: string;
  unit: UnitModel;
  advisor: TeacherModel;
  coAdvisor: ProjectPersonModel | null;
  student: {
    id: string;
    name: string;
    email: string;
    registration: string | null;
    phone: string | null;
    course: CourseModel | null;
    hasDegree: boolean | null;
    cpf: string | null;
    pcd: boolean | null;
  };
  startDate: string;
  endDate: string;
  durationMonths: number;
  area: string | null;
  subarea: string | null;
}

export interface ProjectFilterOptionsModel {
  cycles: string[];
  studentCourses: CourseModel[];
  advisorCourses: CourseModel[];
  programs: ProjectProgram[];
  advisors: ProjectPersonModel[];
  units: UnitModel[];
}

/** Parâmetros aceitos pelo ProjectFilterDTO do backend. */
export interface GetAllProjectsParams {
  cycle?: string;
  q?: string;
  studentCourseId?: string;
  advisorCourseId?: string;
  program?: ProjectProgram;
  scholarshipType?: ScholarshipType;
  situation?: ProjectSituation;
  advisorId?: string;
  unitId?: string;
  sort?: ProjectSort;
  direction?: SortDirection;
}

export interface ImportPersonModel {
  name: string;
  email: string;
  registration?: string | null;
}

export interface ImportProjectModel {
  sisprojNumber: string;
  title: string;
  summary?: string | null;
  program: ProjectProgram;
  scholarshipType: ScholarshipType;
  noticeNumber?: string | null;
  cycle: string;
  area?: string | null;
  subarea?: string | null;
  startDate: string;
  endDate: string;
  unitAcronym: string;
  student: ImportPersonModel;
  advisor: ImportPersonModel;
  coAdvisor?: ImportPersonModel | null;
}

export interface ImportProjectsModel {
  projects: ImportProjectModel[];
}

export interface ImportResultModel {
  created: number;
  updated: number;
  newUsers: Array<{
    user: import("./userModel").UserModel;
    temporaryPassword: string;
  }>;
}
