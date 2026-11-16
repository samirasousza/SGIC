import type { AcademicTitleType } from "../types/academicTitleType";
import type { UserRole } from "../types/userRoleType";
import type { CourseModel } from "./projectModel";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  registration: string | null;
  pcd: boolean | null;
  hasDegree: boolean | null;
  course: CourseModel | null;
  academicTitle: AcademicTitleType | null;
  institution: string | null;
  roles: UserRole[];
  active: boolean;
  profileCompleted: boolean;
  mustChangePassword: boolean;
  privacyAccepted: boolean;
}

export interface RegisterUserModel {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  courseId?: string | null;
  academicTitle?: AcademicTitleType | null;
  institution?: string | null;
  roles: UserRole[];
  requestId?: string | null;
}

export interface UpdateUserModel {
  name: string;
  email: string;
  cpf?: string | null;
  phone?: string | null;
  registration?: string | null;
  courseId?: string | null;
}

export interface TeacherModel {
  id: string;
  name: string;
  email: string;
  course: CourseModel | null;
  academicTitle: AcademicTitleType | null;
  institution: string | null;
}

export interface UserInfosUpdateModel {
  cpf: string;
  courseId: string;
  phone: string;
  pcd?: boolean | null;
  hasDegree?: boolean | null;
}

export interface UpdateUserRolesModel {
  roles: UserRole[];
}

export interface GetAllUsersParams {
  q?: string;
  role?: UserRole;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PaginatedUsersModel {
  content: UserModel[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface RegisterUserResponse {
  user: UserModel;
  temporaryPassword: string;
}
