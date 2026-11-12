import { api } from "../config/apiConfig";
import type {
  GetAllUsersParams,
  PaginatedUsersModel,
  RegisterUserModel,
  RegisterUserResponse,
  TeacherModel,
  UpdateUserRolesModel,
  UserModel,
} from "../models/userModel";

const API_URL_USER = "/users";
const API_URL_TEACHERS = "/users/teachers";

export const updateUserRoles = async (
  id: string,
  data: UpdateUserRolesModel,
): Promise<UserModel> => {
  return (await api.put<UserModel>(`${API_URL_USER}/${id}/roles`, data)).data;
};

export const getAllUsers = async (
  params: GetAllUsersParams,
): Promise<PaginatedUsersModel> => {
  return (await api.get<PaginatedUsersModel>(API_URL_USER, { params })).data;
};

export const registerUser = async (
  data: RegisterUserModel,
): Promise<RegisterUserResponse> => {
  return (await api.post<RegisterUserResponse>(API_URL_USER, data)).data;
};

export const deactivateUser = async (id: string): Promise<void> => {
  await api.patch(`${API_URL_USER}/${id}/deactivate`);
};

export const activateUser = async (id: string): Promise<void> => {
  await api.patch(`${API_URL_USER}/${id}/activate`);
};

export const getTeachers = async (q?: string): Promise<TeacherModel[]> => {
  return (
    await api.get<TeacherModel[]>(API_URL_TEACHERS, {
      params: q ? { q } : undefined,
    })
  ).data;
};
