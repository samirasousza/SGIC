import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { BoardStageCard } from "../../components/Evaluaters/BoardStageCard";
import { ExternalEvaluatorModal } from "../../components/Evaluaters/ExternalEvaluatorModal";
import { Button } from "../../components/Button";

import { useAppContext } from "../../contexts/appContext";

import {
  GetProjectDetails,
  GetProjectBoard,
  RegisterProjectBoard,
} from "../../services/projectService";

import { getTeachers } from "../../services/userService";

import type { ProjectDetailsModel } from "../../models/projectModel";
import type { ProjectBoardMemberModel } from "../../models/projectBoardModel";
import type { DefenseType } from "../../types/defenseType";
import type { TeacherModel } from "../../models/userModel";

type Stage = "partial" | "final";

interface BoardForm {
  date: string;
  time: string;
  location: string;
  first: string;
  second: string;
  status: string;
}

type BoardsState = Record<Stage, BoardForm>;

const initialBoard: BoardForm = {
  date: "",
  time: "",
  location: "",
  first: "",
  second: "",
  status: "Pendente",
};

function getDefenseType(stage: Stage): DefenseType {
  return stage === "partial" ? "PARTIAL" : "FINAL";
}

function getStage(defenseType: DefenseType): Stage {
  return defenseType === "PARTIAL" ? "partial" : "final";
}

function getEvaluatorLabel(evaluator: { name: string; email: string }) {
  return `${evaluator.name} (${evaluator.email})`;
}

function mapBoardsToState(members: ProjectBoardMemberModel[]): BoardsState {
  const result: BoardsState = {
    partial: { ...initialBoard },
    final: { ...initialBoard },
  };

  for (const member of members) {
    const stage = getStage(member.defenseType);

    if (member.memberType === "INTERNAL") {
      result[stage].first = getEvaluatorLabel(member.evaluator);
    }

    if (member.memberType === "EXTERNAL") {
      result[stage].second = getEvaluatorLabel(member.evaluator);
    }

    result[stage].status = "Sugerida";
  }

  return result;
}

export function EvaluatorsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { selectedRole } = useAppContext();

  const [project, setProject] = useState<ProjectDetailsModel | null>(null);
  const [members, setMembers] = useState<ProjectBoardMemberModel[]>([]);
  const [teachers, setTeachers] = useState<TeacherModel[]>([]);

  const [boards, setBoards] = useState<BoardsState>({
    partial: { ...initialBoard },
    final: { ...initialBoard },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [savedStage, setSavedStage] = useState<Stage | null>(null);
  const [externalOpen, setExternalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!projectId) {
      setError("Identificador do projeto não informado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [projectData, boardData, teacherData] = await Promise.all([
        GetProjectDetails(projectId),
        GetProjectBoard(projectId),
        getTeachers(),
      ]);

      setProject(projectData);
      setMembers(boardData);
      setTeachers(teacherData);
      setBoards(mapBoardsToState(boardData));
    } catch {
      setError("Não foi possível carregar os dados da banca.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const isCommittee =
    selectedRole === "LOCAL_COMMITTEE" || selectedRole === "TECHNICAL_SUPPORT";

  const canSuggest = selectedRole === "ADVISOR";
  // || selectedRole === "COADVISOR";

  const canDefine = isCommittee;

  const evaluatorOptions = [
    ...new Set([
      ...teachers.map(getEvaluatorLabel),
      ...members.map((member) => getEvaluatorLabel(member.evaluator)),
    ]),
  ];

  function updateBoard(stage: Stage, field: keyof BoardForm, value: string) {
    setBoards((current) => ({
      ...current,
      [stage]: {
        ...current[stage],
        [field]: value,
      },
    }));
  }

  function findEvaluatorId(
    label: string,
    memberType: "INTERNAL" | "EXTERNAL",
    stage: Stage,
  ): string | undefined {
    const teacher = teachers.find((item) => getEvaluatorLabel(item) === label);

    if (teacher) return teacher.id;

    const existingMember = members.find(
      (member) =>
        member.defenseType === getDefenseType(stage) &&
        member.memberType === memberType &&
        getEvaluatorLabel(member.evaluator) === label,
    );

    return existingMember?.evaluator.id;
  }

  async function save(stage: Stage) {
    if (!projectId) return;

    const board = boards[stage];

    const internalEvaluatorId = findEvaluatorId(board.first, "INTERNAL", stage);

    const externalEvaluatorId = findEvaluatorId(
      board.second,
      "EXTERNAL",
      stage,
    );

    if (!internalEvaluatorId || !externalEvaluatorId) {
      setError(
        "Não foi possível identificar os IDs dos avaliadores selecionados. Selecione novamente os avaliadores.",
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedMembers = await RegisterProjectBoard(
        projectId,
        getDefenseType(stage),
        {
          internalEvaluatorId,
          externalEvaluatorId,
        },
      );

      setMembers((current) => [
        ...current.filter(
          (member) => member.defenseType !== getDefenseType(stage),
        ),
        ...updatedMembers,
      ]);

      setBoards((current) => ({
        ...current,
        [stage]: {
          ...current[stage],
          status: "Sugerida",
        },
      }));

      setEditingStage(null);
      setSavedStage(stage);
    } catch {
      setError("Não foi possível salvar a composição da banca.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Icon name="loader-circle" size={28} />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <Icon name="alert-circle" size={28} />
        <h2 className="mt-3 font-semibold text-slate-800">
          Erro ao carregar projeto
        </h2>
        <p className="mt-1 text-sm text-slate-500">{error}</p>
        <Button className="mt-5" onClick={() => navigate("/projects")}>
          Voltar para projetos
        </Button>
      </div>
    );
  }

  if (!project) return null;

  // O modelo atual do projeto não possui um campo de status de arquivamento
  // nem progresso percentual. Por isso, não é possível reproduzir essas
  // duas regras do mock com segurança.
  const archived = false;
  const locked = false;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos", onClick: () => navigate("/projects") },
          {
            label: project.title,
            onClick: () => navigate(`/projects/${project.id}`),
          },
          { label: "Banca" },
        ]}
      />

      <PageHeader
        title={
          isCommittee
            ? "Definição de banca"
            : canSuggest
              ? "Sugestão de banca"
              : "Bancas do projeto"
        }
        description={`${project.title} • ${project.student.name}`}
      />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {savedStage && (
        <div className="mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" size={18} />
          </span>

          <div>
            <strong className="text-sm font-semibold text-emerald-800">
              Banca salva para a defesa{" "}
              {savedStage === "partial" ? "parcial" : "final"}
            </strong>
            <p className="mt-1 text-sm text-emerald-700">
              A composição foi atualizada com os dados retornados pelo servidor.
            </p>
          </div>
        </div>
      )}

      {isCommittee && (
        <div className="mb-5 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <Icon name="info" size={20} />
          <div>
            <strong className="text-sm font-semibold text-blue-800">
              Sugestões do orientador disponíveis
            </strong>
            <p className="mt-1 text-sm text-blue-700">
              Revise a composição da banca e salve os avaliadores selecionados.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {(["partial", "final"] as const).map((stage) => (
          <BoardStageCard
            key={stage}
            stage={stage}
            board={boards[stage]}
            editing={editingStage === stage}
            canEdit={(canSuggest || canDefine) && !archived}
            canDefine={canDefine}
            archived={archived}
            locked={locked}
            evaluatorOptions={evaluatorOptions}
            onChange={(field, value) => updateBoard(stage, field, value)}
            onEdit={() => {
              setEditingStage(stage);
              setSavedStage(null);
              setError(null);
            }}
            onCancel={() => setEditingStage(null)}
            onSave={() => void save(stage)}
            // onApprove={() => void save(stage)}
            onExternal={() => setExternalOpen(true)}
          />
        ))}
      </div>

      {externalOpen && (
        <ExternalEvaluatorModal
          close={() => setExternalOpen(false)}
          submit={(data) => {
            console.log("Solicitação de avaliador externo:", data);
            setExternalOpen(false);
          }}
        />
        // <ExternalEvaluatorModal
        //   close={() => setExternalOpen(false)}
        //   submit={() => setExternalOpen(false)}
        // />
      )}

      {saving && (
        <div className="fixed bottom-5 right-5 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          Salvando banca...
        </div>
      )}
    </>
  );
}
