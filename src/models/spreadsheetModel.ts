import type { DefenseType } from "../types/defenseType";
import type { ExportFormat, SpreadsheetType } from "../types/spreadsheetType";

export interface GetSpreadsheetParams {
  cycle: string;
  defenseType?: DefenseType;
  unitId?: string;
  format?: ExportFormat;
}

export type { ExportFormat, SpreadsheetType };
