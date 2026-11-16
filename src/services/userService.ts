import { api } from "../config/apiConfig";
import type {
  GetAllUsersParams,
  PaginatedUsersModel,
  RegisterUserModel,
  RegisterUserResponse,
  TeacherModel,
  UpdateUserModel,
  UpdateUserRolesModel,
  UserModel,
} from "../models/userModel";

const API_URL_USER = "/users";
const API_URL_TEACHERS = "/users/teachers";

export const updateUserRoles = async (
  id: string,
  data: UpdateUserRolesModel,
): Promise<UserModel> =>
  (await api.put<UserModel>(`${API_URL_USER}/${id}/roles`, data)).data;

export const updateUser = async (
  id: string,
  data: UpdateUserModel,
): Promise<UserModel> =>
  (await api.put<UserModel>(`${API_URL_USER}/${id}`, data)).data;

export const getAllUsers = async (
  params: GetAllUsersParams,
): Promise<PaginatedUsersModel> =>
  (await api.get<PaginatedUsersModel>(API_URL_USER, { params })).data;

export const getUserById = async (id: string): Promise<UserModel> =>
  (await api.get<UserModel>(`${API_URL_USER}/${id}`)).data;

export const registerUser = async (
  data: RegisterUserModel,
): Promise<RegisterUserResponse> =>
  (await api.post<RegisterUserResponse>(API_URL_USER, data)).data;

export const resetUserPassword = async (
  id: string,
): Promise<RegisterUserResponse> =>
  (await api.post<RegisterUserResponse>(`${API_URL_USER}/${id}/reset-password`))
    .data;

export const deactivateUser = async (id: string): Promise<void> => {
  await api.patch(`${API_URL_USER}/${id}/deactivate`);
};

export const activateUser = async (id: string): Promise<void> => {
  await api.patch(`${API_URL_USER}/${id}/activate`);
};

export const getTeachers = async (q?: string): Promise<TeacherModel[]> =>
  (
    await api.get<TeacherModel[]>(API_URL_TEACHERS, {
      params: q ? { q } : undefined,
    })
  ).data;
