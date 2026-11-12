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