import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { EvaluationDefenseSummary } from "../../components/EvaluationDefenseSummary";
import { EvaluationRecords } from "../../components/EvaluationRecords";
import { SignatureField } from "../../components/SignatureField";
import { EvaluationFields } from "../../components/EvaluationFields";

import type { Role } from "../Login/LoginTypes";
import { projectRows } from "../Projects/ProjectsData";
import { evaluationTitle } from "./EvaluationUtils";

interface ProjectEvaluationsPageProps {
  role: Role;
}

type EvaluationStage = "Parcial" | "Final";

export function ProjectEvaluationDetail({ role }: ProjectEvaluationsPageProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const project = projectRows.find((item) => String(item.id) === projectId);

  const [stage, setStage] = useState<EvaluationStage>("Parcial");
  const [signed, setSigned] = useState(false);
  const [submittedStages, setSubmittedStages] = useState<EvaluationStage[]>([]);

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

  const archived = project.cycle === "2024–2025";
  const finalAvailable = archived;
  const stageCompleted = archived || submittedStages.includes(stage);
  const readOnly = role === "Administrador" || role === "Coorientador";

  const handleStageChange = (nextStage: EvaluationStage) => {
    setStage(nextStage);
    setSigned(false);
  };

  const handleSubmit = () => {
    setSubmittedStages((current) =>
      current.includes(stage) ? current : [...current, stage],
    );
  };

  // const backLabel =
  //   role === "Avaliador"
  //     ? "Voltar para minhas avaliações"
  //     : "Voltar para o projeto";

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

      {/* <button
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        onClick={() => navigate(-1)}
      >
        <Icon name="arrow-left" size={16} />
        {backLabel}
      </button> */}

      <PageHeader
        title={`Avaliação ${stage.toLowerCase()}`}
        description={`${
          role === "Administrador"
            ? "Visualização administrativa"
            : `Formulário de ${role.toLowerCase()}`
        } • ${project.title}`}
        actions={
          <Badge
            tone={
              readOnly
                ? "neutral"
                : stage === "Final" && !finalAvailable
                  ? "neutral"
                  : stageCompleted
                    ? "success"
                    : "warning"
            }
          >
            {readOnly
              ? "Somente leitura"
              : stage === "Final" && !finalAvailable
                ? "Não liberada"
                : stageCompleted
                  ? "Preenchida"
                  : "Pendente"}
          </Badge>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={() => handleStageChange("Parcial")}
          className={`cursor-pointer flex items-center gap-4 rounded-xl border p-4 text-left transition ${
            stage === "Parcial"
              ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-100"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              stage === "Parcial"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            01
          </span>

          <span>
            <strong className="block text-sm font-semibold text-slate-800">
              Avaliação parcial
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              {archived || submittedStages.includes("Parcial")
                ? "Concluída"
                : "Disponível para preenchimento"}
            </small>
          </span>
        </button>

        <button
          onClick={() => handleStageChange("Final")}
          className={`cursor-pointer flex items-center gap-4 rounded-xl border p-4 text-left transition ${
            stage === "Final"
              ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-100"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              stage === "Final"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            02
          </span>

          <span>
            <strong className="block text-sm font-semibold text-slate-800">
              Avaliação final
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              {archived || submittedStages.includes("Final")
                ? "Concluída"
                : "Aguardando pré-requisitos"}
            </small>
          </span>
        </button>
      </div>

      <EvaluationDefenseSummary
        stage={stage}
        project={project}
        archived={archived}
      />

      {stageCompleted ? (
        <div className="mt-6 space-y-5">
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
                  Avaliação {stage.toLowerCase()} preenchida e assinada
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {archived
                    ? "Todos os formulários desta etapa foram preenchidos e assinados. Consulte ou baixe as avaliações disponíveis para o seu perfil."
                    : "Sua avaliação foi registrada com sucesso e não possui mais campos pendentes. A versão assinada está disponível para consulta."}
                </p>
              </div>
            </div>
          </Card>

          <EvaluationRecords role={role} stage={stage} archived={archived} />
        </div>
      ) : stage === "Final" && !finalAvailable ? (
        <div className="mt-6">
          <Card>
            <div className="flex flex-col items-center px-5 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Icon name="clock" size={30} />
              </div>

              <strong className="mt-4 text-base font-semibold text-slate-800">
                Avaliação final ainda não liberada
              </strong>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                O formulário será habilitado após o envio dos relatórios mensais
                1–11 e do relatório parcial.
              </p>
            </div>
          </Card>
        </div>
      ) : readOnly ? (
        <div className="mt-6">
          <EvaluationRecords role={role} stage={stage} />
        </div>
      ) : (
        <div className="mt-6">
          <Card>
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                {evaluationTitle(role)}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preencha todos os campos obrigatórios e assine antes de
                finalizar.
              </p>
            </div>

            <EvaluationFields role={role} />

            <div className="mt-6 border-t border-slate-100 pt-6">
              <SignatureField onSigned={setSigned} />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button variant="secondary">Salvar rascunho</Button>

              <Button icon="check" disabled={!signed} onClick={handleSubmit}>
                Assinar e finalizar avaliação
              </Button>
            </div>

            {!signed && (
              <p className="mt-3 text-right text-xs text-amber-600">
                Assine a avaliação para habilitar a finalização.
              </p>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
