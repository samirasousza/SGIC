import { api } from "../config/apiConfig";
import type { UnitModel } from "../models/projectModel";

const API_URL_UNITS = "/units";

export const GetAllUnits = async (): Promise<UnitModel[]> => {
  return (await api.get<UnitModel[]>(API_URL_UNITS)).data;
};
