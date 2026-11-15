import type { BoardMemberType } from "../types/boardMemberType";
import type { DefenseType } from "../types/defenseType";
export interface RegisterProjectBoardModel {
  internal?: { evaluatorId?: string | null } | null;
  external?: {
    evaluatorId?: string | null;
    awaitingRegistration?: boolean; // só externo
    suggestedName?: string | null; // obrigatório se awaitingRegistration
  } | null;
  defenseDate?: string | null; // "2026-12-10"
  defenseTime?: string | null; // "14:30"
  location?: string | null;
}

interface EvaluatorInfo {
  id: string;
  name: string;
  email: string;
}

export interface BoardMemberModel {
  id: string;
  defenseType: DefenseType;
  memberType: BoardMemberType;
  evaluator: EvaluatorInfo | null; // null se aguardando cadastro
  awaitingRegistration: boolean;
  suggestedName: string | null;
  invitedBy: EvaluatorInfo;
  invitedAt: string;
}

// Uma defesa (PARTIAL ou FINAL) com agendamento e membros.
export interface DefenseBoardModel {
  defenseType: DefenseType;
  defenseDate: string | null; // "2026-12-10"
  defenseTime: string | null; // "14:30:00" (com segundos)
  location: string | null;
  members: BoardMemberModel[]; // vaga vazia = membro ausente
}