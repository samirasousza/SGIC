import { api } from "../config/apiConfig";
import type {
  RegisterUserRequestModel,
  UpdateUserRequestModel,
  UserRequestModel,
} from "../models/UserRequestsModel";
import type { UserRequestStatusType } from "../types/UserRequestStatusType";

const API_URL_USER_REQUESTS = "/user-requests";

export const getUserRequestDetails = async (
  id: string,
): Promise<UserRequestModel> =>
  (await api.get<UserRequestModel>(`${API_URL_USER_REQUESTS}/${id}`)).data;

// status=PENDING (fila) ou APPROVED/REJECTED (histórico). Sem status = todas.
export const getAllUserRequests = async (
  status?: UserRequestStatusType[],
): Promise<UserRequestModel[]> =>
  (
    await api.get<UserRequestModel[]>(API_URL_USER_REQUESTS, {
      params: { status },
      paramsSerializer: { indexes: null }, // status=A&status=B
    })
  ).data;

export const getMyUserRequests = async (): Promise<UserRequestModel[]> =>
  (await api.get<UserRequestModel[]>(`${API_URL_USER_REQUESTS}/mine`)).data;

export const registerUserRequest = async (
  data: RegisterUserRequestModel,
): Promise<UserRequestModel> =>
  (await api.post<UserRequestModel>(API_URL_USER_REQUESTS, data)).data;

export const updateUserRequest = async (
  id: string,
  data: UpdateUserRequestModel,
): Promise<UserRequestModel> =>
  (await api.put<UserRequestModel>(`${API_URL_USER_REQUESTS}/${id}`, data))
    .data;

export const rejectUserRequest = async (id: string): Promise<void> => {
  await api.patch(`${API_URL_USER_REQUESTS}/${id}/reject`);
};
