import type { AcademicTitleType } from "../types/academicTitleType";
import type { UserRequestStatusType } from "../types/UserRequestStatusType";
import type { UserRole } from "../types/userRoleType";
import type { CourseModel, ProjectPersonModel } from "./projectModel";

export interface RegisterUserRequestModel {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  academicTitle?: AcademicTitleType | null;
  institution?: string | null;
  courseId: string;
  projectId?: string | null;
  reason: string;
}

export type UpdateUserRequestModel = RegisterUserRequestModel;

export interface UserRequestRequesterModel {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface UserRequestProjectModel {
  id: string;
  sisprojNumber: string;
  title: string;
}

export interface UserRequestModel {
  id: string;
  status: UserRequestStatusType;
  requestedAt: string;
  requestedBy: UserRequestRequesterModel;
  project: UserRequestProjectModel | null;
  reason: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  academicTitle: AcademicTitleType | null;
  institution: string | null;
  course: CourseModel | null;
  reviewedBy: ProjectPersonModel | null;
  reviewedAt: string | null;
}
