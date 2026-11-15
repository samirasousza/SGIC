import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { BoardStageCard } from "../../components/Evaluaters/BoardStageCard";
import { ExternalEvaluatorModal } from "../../components/Evaluaters/ExternalEvaluatorModal";
import { Button } from "../../components/Button";

import { useAppContext } from "../../contexts/appContext";

import { GetProjectDetails } from "../../services/projectService";
import { getTeachers } from "../../services/userService";
import {
  GetProjectBoard,
  RegisterProjectBoard,
} from "../../services/BoardService";

import type { ProjectDetailsModel } from "../../models/projectModel";
import type { TeacherModel } from "../../models/userModel";
import type {
  BoardMemberModel,
  DefenseBoardModel,
  RegisterProjectBoardModel,
} from "../../models/projectBoardModel";
import type { DefenseType } from "../../types/defenseType";
import { registerUserRequest } from "../../services/userRequestssService";
import { getApiError } from "../../utils/apiErrorResponse";

type Stage = "partial" | "final";

interface BoardForm {
  date: string;
  time: string;
  location: string;
  first: string;
  second: string;
  secondAwaiting: boolean;
  secondName: string;
  status: string;
}

type BoardsState = Record<Stage, BoardForm>;

const initialBoard: BoardForm = {
  date: "",
  time: "",
  location: "",
  first: "",
  second: "",
  secondAwaiting: false,
  secondName: "",
  status: "Pendente",
};

function getDefenseType(stage: Stage): DefenseType {
  return stage === "partial" ? "PARTIAL" : "FINAL";
}

function getEvaluatorLabel(evaluator: { name: string; email: string }) {
  return `${evaluator.name} (${evaluator.email})`;
}

function memberLabel(member: BoardMemberModel) {
  return member.evaluator
    ? getEvaluatorLabel(member.evaluator)
    : `${member.suggestedName ?? ""} (aguardando cadastro)`;
}

function toBoardForm(defense?: DefenseBoardModel): BoardForm {
  if (!defense) return { ...initialBoard };

  const internal = defense.members.find((m) => m.memberType === "INTERNAL");
  const external = defense.members.find((m) => m.memberType === "EXTERNAL");

  return {
    date: defense.defenseDate ?? "",
    time: defense.defenseTime?.slice(0, 5) ?? "",
    location: defense.location ?? "",
    first: internal ? memberLabel(internal) : "",
    second: external ? memberLabel(external) : "",
    secondAwaiting: !!external?.awaitingRegistration,
    secondName: external?.suggestedName ?? "",
    status: defense.members.length ? "Sugerida" : "Pendente",
  };
}

function mapBoardsToState(defenses: DefenseBoardModel[]): BoardsState {
  return {
    partial: toBoardForm(defenses.find((d) => d.defenseType === "PARTIAL")),
    final: toBoardForm(defenses.find((d) => d.defenseType === "FINAL")),
  };
}

export function EvaluatorsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { selectedRole } = useAppContext();

  const [project, setProject] = useState<ProjectDetailsModel | null>(null);
  const [defenses, setDefenses] = useState<DefenseBoardModel[]>([]);
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
  const [externalStage, setExternalStage] = useState<Stage | null>(null);

  const members = defenses.flatMap((d) => d.members);

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error)
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    Promise.all([
      GetProjectDetails(projectId),
      GetProjectBoard(projectId),
      getTeachers(),
    ])
      .then(([projectData, boardData, teacherData]) => {
        if (cancelled) return;

        setProject(projectData);
        setDefenses(boardData);
        setTeachers(teacherData);
        setBoards(mapBoardsToState(boardData));
        setError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar os dados da banca.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const isCommittee =
    selectedRole === "LOCAL_COMMITTEE" || selectedRole === "TECHNICAL_SUPPORT";

  const canSuggest = selectedRole === "ADVISOR";
  const canDefine = isCommittee;

  // Só avaliadores cadastrados entram nas opções (sugestões sem cadastro não).
  const evaluatorOptions = [
    ...new Set([
      ...teachers.map(getEvaluatorLabel),
      ...members.filter((m) => m.evaluator).map(memberLabel),
    ]),
  ];

  function updateBoard(stage: Stage, field: keyof BoardForm, value: string) {
    setError(null); // some o erro ao editar qualquer campo
    setBoards((current) => ({
      ...current,
      [stage]: {
        ...current[stage],
        [field]: value,
        ...(field === "second"
          ? { secondAwaiting: false, secondName: "" }
          : {}),
      },
    }));
  }

  function setAwaiting(stage: Stage, awaiting: boolean) {
    setError(null);
    setBoards((current) => ({
      ...current,
      [stage]: {
        ...current[stage],
        secondAwaiting: awaiting,
        second: "",
        secondName: awaiting ? current[stage].secondName : "",
      },
    }));
  }

  function findEvaluatorId(label: string): string | undefined {
    const teacher = teachers.find((t) => getEvaluatorLabel(t) === label);
    if (teacher) return teacher.id;

    return members.find(
      (m) => m.evaluator && getEvaluatorLabel(m.evaluator) === label,
    )?.evaluator?.id;
  }

  async function save(stage: Stage) {
    if (!projectId) return;

    const board = boards[stage];
    const type = getDefenseType(stage);

    const internalId = board.first ? findEvaluatorId(board.first) : undefined;
    if (board.first && !internalId) {
      setError("Avaliador interno não identificado. Selecione novamente.");
      return;
    }

    let external: RegisterProjectBoardModel["external"] = null;

    if (board.secondAwaiting) {
      if (!board.secondName.trim()) {
        setError("Informe o nome da pessoa sugerida que aguarda cadastro.");
        return;
      }
      external = {
        awaitingRegistration: true,
        suggestedName: board.secondName.trim(),
      };
    } else if (board.second) {
      const id = findEvaluatorId(board.second);
      if (!id) {
        setError("Avaliador externo não identificado. Selecione novamente.");
        return;
      }
      external = { evaluatorId: id, awaitingRegistration: false };
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await RegisterProjectBoard(projectId, type, {
        internal: internalId ? { evaluatorId: internalId } : null,
        external,
        defenseDate: board.date || null,
        defenseTime: board.time || null,
        location: board.location.trim() || null,
      });

      setDefenses((current) => [
        ...current.filter((d) => d.defenseType !== type),
        updated,
      ]);
      setBoards((current) => ({ ...current, [stage]: toBoardForm(updated) }));
      setEditingStage(null);
      setSavedStage(stage);
    } catch (err) {
      const { message, fieldErrors } = getApiError(err);

      setError(
        Object.keys(fieldErrors).length
          ? Object.entries(fieldErrors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(" · ")
          : message,
      );
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

  const archived = false;
  const locked = false;

  return (
    <div className="space-y-5">
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos", onClick: () => navigate("/projects") },
          {
            label: project.title,
            onClick: () => navigate(`/projects/${project.id}`),
          },
          { label: "Bancas" },
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
      />

      {canSuggest && (
        <div className="mb-5 flex flex-wrap justify-end gap-2">
          <Button
            variant="secondary"
            icon="user-plus"
            onClick={() => {
              setExternalStage("partial");
              setExternalOpen(true);
            }}
          >
            Solicitar cadastro de avaliador externo
          </Button>

          <Button
            variant="secondary"
            icon="clock"
            onClick={() =>
              navigate(`/projects/${project.id}/evaluators/requests`)
            }
          >
            Minhas solicitações
          </Button>
        </div>
      )}

      {error && (
        <div
          ref={errorRef}
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <strong className="block font-semibold">
            Não foi possível salvar a banca
          </strong>
          <p className="mt-1 break-words">{error}</p>
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
            onAwaitingChange={(awaiting) => setAwaiting(stage, awaiting)}
            onEdit={() => {
              setEditingStage(stage);
              setSavedStage(null);
              setError(null);
            }}
            onCancel={() => {
              setEditingStage(null);
              // descarta o que foi digitado e volta ao que está salvo
              setBoards((current) => ({
                ...current,
                [stage]: toBoardForm(
                  defenses.find((d) => d.defenseType === getDefenseType(stage)),
                ),
              }));
            }}
            onSave={() => void save(stage)}
          />
        ))}
      </div>

      {externalOpen && externalStage && (
        <ExternalEvaluatorModal
          close={() => setExternalOpen(false)}
          defaultReason={`Avaliador externo do projeto "${project.title}"`}
          submit={async (data) => {
            // Se falhar, o erro sobe para o modal (409 de e-mail/CPF, por exemplo).
            await registerUserRequest({
              ...data,
              projectId: projectId ?? null,
            });

            setBoards((current) => ({
              ...current,
              [externalStage]: {
                ...current[externalStage],
                second: "",
                secondAwaiting: true,
                secondName: data.name,
              },
            }));
            setExternalOpen(false);
          }}
        />
      )}

      {saving && (
        <div className="fixed bottom-5 right-5 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          Salvando banca...
        </div>
      )}
    </div>
  );
}
