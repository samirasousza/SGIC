import { api } from "../config/apiConfig";
import type { UserInfosUpdateModel, UserModel } from "../models/userModel";

const API_URL_ME = "/me";

export const registerStudentInfo = async (
  registerData: UserInfosUpdateModel,
): Promise<UserModel> =>
  (await api.put<UserModel>(`${API_URL_ME}/profile`, registerData)).data;

export const userData = async (): Promise<UserModel> =>
  (await api.get<UserModel>(API_URL_ME)).data;

export const acceptPrivacyNotice = async (): Promise<UserModel> =>
  (await api.post<UserModel>(`${API_URL_ME}/privacy-acceptance`)).data;
