import { api } from "../config/apiConfig";
import type { LoginModel, UpdatePasswordModel } from "../models/loginModel";

const API_URL_LOGIN = `/auth/login`;
const API_URL_UPDATE_PASSWORD = `/auth/change-password`;

export const login = async (loginData: LoginModel) => {
  return (await api.post(API_URL_LOGIN, loginData)).data;
};

export const updatePassword = async (
  updatePasswordData: UpdatePasswordModel,
) => {
  return (await api.post(API_URL_UPDATE_PASSWORD, updatePasswordData)).data;
};
