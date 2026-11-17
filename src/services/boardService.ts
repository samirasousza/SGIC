import { api } from "../config/apiConfig";
import type {
  BoardPanelModel,
  DefenseBoardModel,
  RegisterProjectBoardModel,
} from "../models/projectBoardModel";
import type { GetAllProjectsParams } from "../models/projectModel";
import type { DefenseType } from "../types/defenseType";

const API_URL_PROJECTS = "/projects";
const API_URL_BOARDS = "/boards";

export const GetProjectBoard = async (
  id: string,
): Promise<DefenseBoardModel[]> =>
  (await api.get<DefenseBoardModel[]>(`${API_URL_PROJECTS}/${id}/board`)).data;

export const GetBoardsPanel = async (
  params?: GetAllProjectsParams,
): Promise<BoardPanelModel> =>
  (
    await api.get<BoardPanelModel>(`${API_URL_BOARDS}/panel`, {
      params,
    })
  ).data;

export const RegisterProjectBoard = async (
  id: string,
  defenseType: DefenseType,
  data: RegisterProjectBoardModel,
): Promise<DefenseBoardModel> =>
  (
    await api.put<DefenseBoardModel>(
      `${API_URL_PROJECTS}/${id}/board/${defenseType}`,
      data,
    )
  ).data;

// export const RemoveProjectBoardMember = async (
//   projectId: string,
//   memberId: string,
//   justification: string,
// ): Promise<void> => {
//   await api.post(
//     `${API_URL_PROJECTS}/${projectId}/board/members/${memberId}/remove`,
//     { justification },
//   );
// };
