import { api } from "../config/apiConfig";
import type { UserInfosUpdateModel, UserModel } from "../models/userModel";

const API_URL_USER_INFOS = `/me`;
const API_URL_USER = `/me/profile`;

export const registerStudentInfo = async (registerData: UserInfosUpdateModel) => {
  return (await api.put(API_URL_USER, registerData)).data;
};

export const userData = async () => {
  return (await api.get<UserModel>(API_URL_USER_INFOS)).data;
};
