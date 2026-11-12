import type { BoardMemberType } from "../types/boardMemberType";
import type { DefenseType } from "../types/defenseType";

export interface RegisterProjectBoardModel {
  internalEvaluatorId: string;
  externalEvaluatorId: string;
}

export interface ProjectBoardMemberModel {
  id: string;
  defenseType: DefenseType;
  memberType: BoardMemberType;
  evaluator: {
    id: string;
    name: string;
    email: string;
  };
  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
  invitedAt: string;
}
