import type { UserRole } from "../types/userRoleType";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  registration: string;
  pcd: boolean;
  hasDegree: boolean;
  course: {
    id: string;
    name: string;
    unit: { id: string; name: string; acronym: string };
  };
  roles: UserRole[];
  active: boolean;
  profileCompleted: boolean;
  mustChangePassword: boolean;
}

export interface UserInfosUpdateModel {
  cpf: string;
  courseId: string;
  phone: string;
  pcd: boolean;
  hasDegree: boolean;
}

export interface UpdateUserRolesModel {
  roles: UserRole[];
}

export interface RegisterUserModel {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  courseId: string;
  roles: UserRole[];
}

export interface TeacherModel {
  id: string;
  name: string;
  email: string;
  course: {
    id: string;
    name: string;
    unit: {
      id: string;
      name: string;
      acronym: string;
    };
  };
}

export interface GetAllUsersParams {
  q?: string;
  page: number;
  size: number;
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
