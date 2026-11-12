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

export interface ProjectModel {
  id: string;
  sisprojNumber: string;
  title: string;
  cycle: string;
  program: string;
  scholarshipType: ScholarshipType;
  unit: UnitModel;
  student: ProjectPersonModel;
  studentCourse: string;
  advisor: ProjectPersonModel;
  startDate: string;
  endDate: string;
  situation: ProjectSituation;
}

export interface ProjectDetailsModel {
  id: string;
  sisprojNumber: string;
  title: string;
  summary: string;
  program: string;
  scholarshipType: ScholarshipType;
  noticeNumber: string | null;
  cycle: string;
  unit: UnitModel;
  advisor: ProjectPersonModel;
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
  courses: {
    id: string;
    name: string;
    unit: UnitModel;
  }[];
  programs: string[];
  advisors: ProjectPersonModel[];
  units: UnitModel[];
}

export interface GetAllProjectsParams {
  cycle?: string;
  q?: string; // Busca, sem diferenciar maiúsculas, no título, nome do aluno, nome do orientador e nº SISPROJ. Example : maria
  courseId?: string;
  program?: ProjectProgram; // tipo de bolsa
  scholarshipType?: ScholarshipType; // bolsista ou voluntário
  situation?: ProjectSituation; //situação dos relatórios
  advisorId?: string;
  unitId?: string;
  sort?: ProjectSort; // campo de ordenação
  direction?: SortDirection; // direção da ordenação
}
