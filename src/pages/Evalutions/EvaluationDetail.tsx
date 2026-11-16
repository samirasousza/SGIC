import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { EvaluationDefenseSummary } from "../../components/Evaluations/EvaluationDefenseSummary";
import { EvaluationRecords } from "../../components/Evaluations/EvaluationRecords";
import { EvaluationFields } from "../../components/Evaluations/EvaluationFields";
import { SignatureField } from "../../components/Evaluations/SignatureField";
import type {
  EvaluationFormModel,
  ProjectEvaluationsModel,
  SaveEvaluationModel,
} from "../../models/evaluationModel";
import {
  GetEvaluationFormMine,
  GetEvaluationFormSituation,
  ReopenEvaluationForm,
  SaveEvaluationForm,
  SignAndSaveEvaluationForm,
} from "../../services/evaluationsService";
import { GetProjectDetails } from "../../services/projectService";
import type { ProjectDetailsModel } from "../../models/projectModel";
import type { DefenseBoardModel } from "../../models/projectBoardModel";
import type { DefenseType } from "../../types/defenseType";
import { evaluationTitle } from "./EvaluationUtils";
import { GetProjectBoard } from "../../services/BoardService";
import { useAppContext } from "../../contexts/appContext";

function initialDraft(form: EvaluationFormModel): SaveEvaluationModel {
  return {
    ...(form.formType === "BOARD"
      ? { presentationTime: form.presentationTime ?? "" }
      : {}),
    comments: form.comments ?? "",
    items: form.items
      .filter((item) => item.scale !== "COMPUTED")
      .map((item) => ({
        code: item.code,
        score: item.score,
        notApplicable: item.notApplicable,
      })),
  };
}

function stateLabel(state?: string) {
  switch (state) {
    case "SIGNED":
      return "Assinada";
    case "IN_PROGRESS":
      return "Em preenchimento";
    case "PENDING":
      return "Pendente";
    case "NOT_RELEASED":
      return "Não liberada";
    default:
      return "Carregando";
  }
}

function stateTone(state?: string): "success" | "warning" | "neutral" {
  if (state === "SIGNED") return "success";
  if (state === "PENDING" || state === "IN_PROGRESS") return "warning";
  return "neutral";
}

export function ProjectEvaluationDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDetailsModel | null>(null);
  const [boards, setBoards] = useState<DefenseBoardModel[]>([]);
  const [overview, setOverview] = useState<ProjectEvaluationsModel | null>(
    null,
  );
  const [stage, setStage] = useState<DefenseType>("PARTIAL");
  const [form, setForm] = useState<EvaluationFormModel | null>(null);
  const [draft, setDraft] = useState<SaveEvaluationModel | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { selectedRole: role } = useAppContext();

  useEffect(() => {
    if (!projectId) return;

    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;

        setLoading(true);
        setError("");

        return Promise.all([
          GetProjectDetails(projectId),
          GetProjectBoard(projectId).catch(() => [] as DefenseBoardModel[]),
          GetEvaluationFormSituation(projectId),
        ]);
      })
      .then((result) => {
        if (!active || !result) return;

        const [projectData, boardData, evaluationData] = result;

        setProject(projectData);
        setBoards(boardData);
        setOverview(evaluationData);
      })
      .catch(() => {
        if (active) {
          setError(
            "Não foi possível carregar os dados do projeto e das avaliações.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  const defense = useMemo(
    () => overview?.defenses.find((item) => item.defenseType === stage),
    [overview, stage],
  );
  const mine = defense?.forms.find((item) => item.mine);
  const board = boards.find((item) => item.defenseType === stage);

  useEffect(() => {
    if (!projectId) return;

    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;

        setForm(null);
        setDraft(null);

        if (!mine) return null;

        return GetEvaluationFormMine(projectId, stage);
      })
      .then((data) => {
        if (!active || !data) return;

        setForm(data);
        setDraft(initialDraft(data));
      })
      .catch(() => {
        if (active) {
          setError("Não foi possível carregar sua ficha de avaliação.");
        }
      });

    return () => {
      active = false;
    };
  }, [projectId, stage, mine]);

  const refreshOverview = async () => {
    if (!projectId) return;
    const data = await GetEvaluationFormSituation(projectId);
    setOverview(data);
  };

  const handleSave = async () => {
    if (!projectId || !draft) return;
    setSaving(true);
    setError("");
    try {
      const updated = await SaveEvaluationForm(projectId, stage, draft);
      setForm(updated);
      setDraft(initialDraft(updated));
      await refreshOverview();
    } catch {
      setError(
        "Não foi possível salvar a avaliação. Confira os campos e tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSign = async () => {
    if (!projectId || !draft || !signature) return;
    setSaving(true);
    setError("");
    try {
      await SaveEvaluationForm(projectId, stage, draft);
      const signed = await SignAndSaveEvaluationForm(projectId, stage, {
        signature,
      });
      setForm(signed);
      setDraft(initialDraft(signed));
      setSignature(null);
      await refreshOverview();
    } catch {
      setError(
        "Não foi possível assinar a avaliação. Verifique se todos os itens obrigatórios foram preenchidos e se a assinatura é válida.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReopen = async (id: string, justification: string) => {
    await ReopenEvaluationForm(id, { justification });
    await refreshOverview();
    if (mine?.evaluationId === id && projectId) {
      const updated = await GetEvaluationFormMine(projectId, stage);
      setForm(updated);
      setDraft(initialDraft(updated));
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Carregando avaliações...
      </div>
    );

  if (error && !project) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <Button className="mt-5" onClick={() => navigate("/project")}>
          Voltar para projetos
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Icon name="file-search" size={40} />
        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          Projeto não encontrado
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Não foi possível localizar o projeto solicitado.
        </p>
        <Button className="mt-5" onClick={() => navigate("/project")}>
          Voltar para projetos
        </Button>
      </div>
    );
  }

  if (!role) {
    return <p>Não foi possível identificar seu perfil de acesso.</p>;
  }

  const isSigned = form?.state === "SIGNED" || mine?.state === "SIGNED";
  const editable = Boolean(form?.editable && !isSigned);
  const blocked = form?.blockedReason ?? defense?.blockedReason;

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
          { label: "Avaliações" },
        ]}
      />

      <PageHeader
        title={`Avaliação ${stage === "PARTIAL" ? "parcial" : "final"}`}
        actions={
          <Badge tone={stateTone(form?.state ?? mine?.state)}>
            {stateLabel(form?.state ?? mine?.state)}
          </Badge>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["PARTIAL", "FINAL"] as DefenseType[]).map((type, index) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setStage(type);
              setSignature(null);
              setError("");
            }}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition ${stage === type ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-100" : "border-slate-200 bg-white hover:border-slate-300"}`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${stage === type ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              0{index + 1}
            </span>
            <span>
              <strong className="block text-sm font-semibold text-slate-800">
                Avaliação {type === "PARTIAL" ? "parcial" : "final"}
              </strong>
              <small className="mt-1 block text-xs text-slate-500">
                {type === "PARTIAL" ? "Defesa parcial" : "Defesa final"}
              </small>
            </span>
          </button>
        ))}
      </div>

      <EvaluationDefenseSummary
        project={project}
        board={board}
        defense={defense}
      />

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-5">
        {mine && form && editable && draft ? (
          <Card>
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                {evaluationTitle(role)}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Preencha os itens da ficha oficial. As alterações podem ser
                salvas antes da assinatura.
              </p>
              {form.score !== null && (
                <p className="mt-2 text-sm font-medium text-indigo-700">
                  Nota parcial: {form.score.toFixed(2)} / 100
                </p>
              )}
            </div>

            {blocked && (
              <p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {blocked}
              </p>
            )}
            <EvaluationFields
              form={form}
              value={draft}
              onChange={setDraft}
              disabled={!editable || saving}
            />
            <div className="mt-6 border-t border-slate-100 pt-6">
              <SignatureField onSignatureChange={setSignature} />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                disabled={saving}
                onClick={() => void handleSave()}
              >
                {saving ? "Salvando..." : "Salvar rascunho"}
              </Button>
              <Button
                icon="check"
                disabled={!signature || saving || Boolean(blocked)}
                onClick={() => void handleSign()}
              >
                {saving ? "Enviando..." : "Assinar e finalizar avaliação"}
              </Button>
            </div>
            {!signature && (
              <p className="mt-3 text-right text-xs text-amber-600">
                Assine a avaliação para habilitar a finalização.
              </p>
            )}
          </Card>
        ) : mine && (isSigned || form?.state === "SIGNED") ? (
          <Card>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon name="check" size={28} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Etapa concluída
                </span>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  Avaliação assinada
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Sua ficha foi assinada e está disponível para consulta em PDF
                  conforme as permissões do seu perfil.
                </p>
              </div>
            </div>
          </Card>
        ) : mine && blocked ? (
          <Card>
            <div className="flex flex-col items-center px-5 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Icon name="clock" size={30} />
              </div>
              <strong className="mt-4 text-base font-semibold text-slate-800">
                Avaliação ainda não liberada
              </strong>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                {blocked}
              </p>
            </div>
          </Card>
        ) : !mine ? (
          <Card>
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-slate-500">
                Seu perfil não possui uma ficha para preencher nesta defesa.
                Consulte abaixo as avaliações que você tem permissão para
                acompanhar.
              </p>
            </div>
          </Card>
        ) : !form ? (
          <Card>
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              Carregando sua ficha...
            </div>
          </Card>
        ) : (
          <Card>
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              Esta ficha está disponível somente para consulta.
            </div>
          </Card>
        )}

        <EvaluationRecords defense={defense} onReopen={handleReopen} />
      </div>
    </>
  );
}
