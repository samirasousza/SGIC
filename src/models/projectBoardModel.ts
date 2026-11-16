import type { BoardMemberType } from "../types/boardMemberType";
import type { DefenseType } from "../types/defenseType";
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
