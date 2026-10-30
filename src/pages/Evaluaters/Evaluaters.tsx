import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { BoardStageCard } from "../../components/BoardStageCard";
import { ExternalEvaluatorModal } from "../../components/ExternalEvaluatorModal";

import { isAdvisorRole } from "../Projects/Projects.utils";
import { projectRows } from "../Projects/ProjectsData";
import type { Role } from "../Login/LoginTypes";

type Stage = "partial" | "final";

interface Board {
  date: string;
  time: string;
  location: string;
  first: string;
  second: string;
  status: string;
}

export function EvaluatorsPage({ role }: { role: Role }) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const project = projectRows.find((item) => item.id === projectId);

  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [savedStage, setSavedStage] = useState<Stage | null>(null);
  const [externalOpen, setExternalOpen] = useState(false);
  const [externalRequested, setExternalRequested] = useState(false);

  //   const [boards, setBoards] = useState<Record<Stage, Board>>({
  //     partial: {
  //       date: "2026-03-24",
  //       time: "14:00",
  //       location: "Sala 203 — EST",
  //       first: "Profa. Marina Araújo",
  //       second: "Prof. Davi Oliveira",
  //       status: "Sugerida",
  //     },
  //     final: {
  //       date: "2026-09-18",
  //       time: "09:00",
  //       location: "",
  //       first: "Profa. Carla Mendes",
  //       second: "Prof. André Oliveira",
  //       status: "Sugerida",
  //     },
  //   });

  const [boards, setBoards] = useState<Record<Stage, Board>>({
    partial: {
      date: "",
      time: "",
      location: "",
      first: "",
      second: "",
      status: "Pendente",
    },
    final: {
      date: "",
      time: "",
      location: "",
      first: "",
      second: "",
      status: "Pendente",
    },
  });

  if (!project) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <Icon name="alert-circle" size={28} />
        <h2 className="mt-3 font-semibold text-slate-800">
          Projeto não encontrado
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Não foi possível localizar o projeto solicitado.
        </p>
        <button
          onClick={() => navigate("/project")}
          className="mt-4 text-sm font-semibold text-[#143c54] hover:underline"
        >
          Voltar para projetos
        </button>
      </div>
    );
  }

  const archived = project.cycle === "2024–2025";
  const isCommittee = role === "Comitê local" || role === "Apoio técnico";
  const canSuggest = isAdvisorRole(role) && !archived;
  const canDefine = isCommittee && !archived;

  const updateBoard = (stage: Stage, field: keyof Board, value: string) => {
    setBoards((current) => ({
      ...current,
      [stage]: {
        ...current[stage],
        [field]: value,
      },
    }));
  };

  //   const save = (stage: Stage) => {
  //     setEditingStage(null);
  //     setSavedStage(stage);
  //   };

  const save = (stage: Stage) => {
    setBoards((current) => ({
      ...current,
      [stage]: {
        ...current[stage],
        status: canDefine ? current[stage].status : "Sugerida",
      },
    }));

    setEditingStage(null);
    setSavedStage(stage);
  };

  const approve = (stage: Stage) => {
    setBoards((current) => ({
      ...current,
      [stage]: {
        ...current[stage],
        status: "Definida",
      },
    }));

    setSavedStage(stage);
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos", onClick: () => navigate("/project") },
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
        description={`${project.title} • ${project.student}`}
      />

      {/* Mensagem de confirmação */}
      {savedStage && (
        <div className="mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" size={18} />
          </span>

          <div>
            <strong className="text-sm font-semibold text-emerald-800">
              {canDefine ? "Banca atualizada" : "Sugestão registrada"} para a
              defesa {savedStage === "partial" ? "parcial" : "final"}
            </strong>
            <p className="mt-1 text-sm text-emerald-700">
              {canDefine
                ? "As alterações foram registradas nesta visualização."
                : "O comitê local poderá revisar e alterar os dados antes da confirmação."}
            </p>
          </div>
        </div>
      )}

      {externalRequested && (
        <div className="mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" size={18} />
          </span>

          <div>
            <strong className="text-sm font-semibold text-emerald-800">
              Solicitação registrada
            </strong>
            <p className="mt-1 text-sm text-emerald-700">
              O avaliador externo aparecerá como pendente até a conclusão do
              cadastro.
            </p>
          </div>
        </div>
      )}

      {/* Orientação para o comitê */}
      {isCommittee && !archived && (
        <div className="mb-5 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <Icon name="info" size={20} />
          <div>
            <strong className="text-sm font-semibold text-blue-800">
              Sugestões do orientador disponíveis
            </strong>
            <p className="mt-1 text-sm text-blue-700">
              Revise data, horário, local e avaliadores. A banca só será
              considerada definida após sua confirmação.
            </p>
          </div>
        </div>
      )}

      {/* Aviso de ciclo encerrado */}
      {archived && (
        <div className="mb-5 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Icon name="info" size={20} />
          <div>
            <strong className="text-sm font-semibold text-slate-700">
              Ciclo encerrado
            </strong>
            <p className="mt-1 text-sm text-slate-500">
              As bancas deste projeto estão disponíveis somente para consulta.
            </p>
          </div>
        </div>
      )}

      {/* Bancas */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {(["partial", "final"] as const).map((stage) => (
          <BoardStageCard
            key={stage}
            stage={stage}
            board={boards[stage]}
            editing={editingStage === stage}
            canEdit={canSuggest || canDefine}
            canDefine={canDefine}
            archived={archived}
            locked={stage === "final" && !archived && project.progress < 80}
            onChange={(field, value) => updateBoard(stage, field, value)}
            onEdit={() => {
              setEditingStage(stage);
              setSavedStage(null);
            }}
            onCancel={() => setEditingStage(null)}
            onSave={() => save(stage)}
            onApprove={() => approve(stage)}
            onExternal={() => setExternalOpen(true)}
          />
        ))}
      </div>

      {externalOpen && (
        <ExternalEvaluatorModal
          close={() => setExternalOpen(false)}
          submit={() => {
            setExternalOpen(false);
            setExternalRequested(true);
          }}
        />
      )}
    </>
  );
}
