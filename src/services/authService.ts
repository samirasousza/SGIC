import { api } from "../config/apiConfig";


const API_URL_LOGIN = `/auth/login`;
const API_URL_UPDATE_PASSWORD = `/auth/change-password`;

interface LoginData {
  email: string;
  password: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const login = async (loginData: LoginData) => {
  return (await api.post(API_URL_LOGIN, loginData)).data;
};

export const updatePassword = async (
  updatePasswordData: UpdatePasswordData
) => {
  return (await api.post(API_URL_UPDATE_PASSWORD, updatePasswordData)).data;
};
