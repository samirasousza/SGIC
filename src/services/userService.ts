import { api } from "#/config/apiConfig";
import { RegisterModel } from "#/modules/auth/models/RegisterModel";

const API_URL_LOGIN = `/me`;
const API_URL_UPDATE_USER = `/me/profile`;

interface LoginData {
  login: string;
  password: string;
}

interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

// interface RecoverPasswordData {
//   email: string;
// }

export const login = async (loginData: LoginData) => {
  return (await api.post(API_URL_LOGIN, loginData)).data;
};

export const register = async (registerData: RegisterModel) => {
  return (await api.put(API_URL_UPDATE_USER, registerData)).data;
};

export const updatePassword = async (
  updatePasswordData: UpdatePasswordData
) => {
  return (await api.post(API_URL_UPDATE_PASSWORD, updatePasswordData)).data;
};

// export const recoverPassword = async (
//   recoverPasswordData: RecoverPasswordData
// ) => {
//   return (await api.post(API_URL_RECOVER_PASSWORD, recoverPasswordData)).data;
// };

// export const dismissPasswordChange = async () => {
//   return await api.post("/api/user/dismiss-password-change");
// };
