import { api } from "../config/apiConfig";
import type { GetSpreadsheetParams } from "../models/spreadsheetModel";
import type { SpreadsheetType } from "../types/spreadsheetType";

const API_URL_SPREADSHEETS = "/spreadsheets";

export const GetSpreadsheet = async (
  type: SpreadsheetType,
  params: GetSpreadsheetParams,
): Promise<Blob> =>
  (
    await api.get<Blob>(`${API_URL_SPREADSHEETS}/${type}`, {
      params,
      responseType: "blob",
    })
  ).data;
