import type { DefenseType } from "../types/defenseType";
import type { ExportFormat, SpreadsheetType } from "../types/spreadsheetType";

export interface GetSpreadsheetParams {
  cycle: string;
  defenseType?: DefenseType;
  unitId?: string;
  format?: ExportFormat;
}

export interface SpreadsheetDefinition {
  id: SpreadsheetType;
  title: string;
  availability: "Parcial e final" | "Somente final";
  sensitive: boolean;
  description: string;
  columns: string[];
}
