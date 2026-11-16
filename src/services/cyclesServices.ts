import { api } from "../config/apiConfig";
import type {
  CycleModel,
  RegisterCycleModel,
  UpdateCycleModel,
} from "../models/cycleModel";

const API_URL_CYCLES = "/cycles";

export const GetCycles = async (): Promise<CycleModel[]> =>
  (await api.get<CycleModel[]>(API_URL_CYCLES)).data;

export const UpdateCycle = async (
  id: string,
  data: UpdateCycleModel,
): Promise<CycleModel> =>
  (await api.put<CycleModel>(`${API_URL_CYCLES}/${id}`, data)).data;

export const RegisterCycle = async (
  data: RegisterCycleModel,
): Promise<CycleModel> =>
  (await api.post<CycleModel>(API_URL_CYCLES, data)).data;
