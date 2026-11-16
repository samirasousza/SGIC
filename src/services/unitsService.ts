import { api } from "../config/apiConfig";
import type { UnitModel, UnitRequestModel } from "../models/unitModel";

const API_URL_UNITS = "/units";

export const GetAllUnits = async (): Promise<UnitModel[]> =>
  (await api.get<UnitModel[]>(API_URL_UNITS)).data;

export const RegisterUnit = async (
  data: UnitRequestModel,
): Promise<UnitModel> => (await api.post<UnitModel>(API_URL_UNITS, data)).data;

export const UpdateUnit = async (
  id: string,
  data: UnitRequestModel,
): Promise<UnitModel> =>
  (await api.put<UnitModel>(`${API_URL_UNITS}/${id}`, data)).data;
