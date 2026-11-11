import { api } from "../config/apiConfig";

const API_URL_USER_INFOS = `/me`;
const API_URL_USER = `/me/profile`;

export type UserRole =
  | "STUDENT"
  | "ADVISOR"
  | "EVALUATOR"
  | "LOCAL_COMMITTEE"
  | "TECHNICAL_SUPPORT"
  | "ADMIN";

interface RegisterModel {
  cpf: string;
  courseId: string;
  phone: string;
  pcd: boolean;
  hasDegree: boolean;
}

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

export const registerStudentInfo = async (registerData: RegisterModel) => {
  return (await api.put(API_URL_USER, registerData)).data;
};

export const userData = async () => {
  return (await api.get<UserModel>(API_URL_USER_INFOS)).data;
};
