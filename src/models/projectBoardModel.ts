import type { BoardMemberType } from "../types/boardMemberType";
import type { BoardSlotState } from "../types/boardSlotState";
import type { DefenseType } from "../types/defenseType";
import type { ProjectModel } from "./projectModel";
export interface RegisterProjectBoardModel {
  internal?: { evaluatorId?: string | null } | null;
  external?: {
    evaluatorId?: string | null;
    awaitingRegistration?: boolean;
    suggestedName?: string | null;
  } | null;
  defenseDate?: string | null;
  defenseTime?: string | null;
  location?: string | null;
}

export interface BoardPersonModel {
  id: string;
  name: string;
  email: string;
}

export interface BoardMemberModel {
  id: string;
  defenseType: DefenseType;
  memberType: BoardMemberType;
  evaluator: BoardPersonModel | null;
  awaitingRegistration: boolean;
  suggestedName: string | null;
  invitedBy: BoardPersonModel;
  invitedAt: string;
}

export interface DefenseBoardModel {
  defenseType: DefenseType;
  defenseDate: string | null;
  defenseTime: string | null;
  location: string | null;
  members: BoardMemberModel[];
}

export interface RemoveProjectBoardMemberModel {
  justification: string;
}

export interface BoardPanelSlotModel {
  state: BoardSlotState;
  name: string | null;
}

export interface BoardPanelModel {
  rows: Array<{
    project: ProjectModel;
    defenses: Array<{
      defenseType: DefenseType;
      defenseDate: string | null;
      defenseTime: string | null;
      internal: BoardPanelSlotModel;
      external: BoardPanelSlotModel;
    }>;
  }>;
}
