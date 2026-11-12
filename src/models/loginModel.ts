export interface LoginModel {
  email: string;
  password: string;
}

export interface UpdatePasswordModel {
  currentPassword: string;
  newPassword: string;
}