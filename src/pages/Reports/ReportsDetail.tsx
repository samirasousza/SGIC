import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { useAppContext } from "../../contexts/appContext";
import { ReportReview } from "../../components/Reports/ReportReview";
import { ReportUploadModal } from "../../components/Reports/ReportUploadModal";
import type { ProjectDetailsModel } from "../../models/projectModel";
import type {
  ProjectReportsModel,
  ReportModel,
} from "../../models/reportModel";
import { GetProjectDetails } from "../../services/projectService";
import {
  DownloadReportTemplate,
  GetReportsProject,
} from "../../services/reportsService";
import type { ReportCell } from "../../types/reportType";

function getCellTone(
  cell: ReportCell,
): "success" | "warning" | "danger" | "orange" | "neutral" {
  switch (cell) {
    case "APPROVED":
      return "success";
    case "IN_REVIEW":
      return "warning";
    case "CHANGES_REQUESTED":
      return "orange";
    case "LATE":
      return "danger";
    case "NOT_DUE":
      return "neutral";
  }
}

function getCellLabel(cell: ReportCell): string {
  switch (cell) {
    case "APPROVED":
      return "Aprovado";
    case "IN_REVIEW":
      return "Em análise";
    case "CHANGES_REQUESTED":
      return "Ajustes solicitados";
    case "LATE":
      return "Atrasado";
    case "NOT_DUE":
      return "Não previsto";
  }
}

function getReportDisplayStatus(report: ReportModel): ReportCell {
  if (report.status === "NOT_SENT") {
    return report.cell;
  }

  switch (report.status) {
    case "UNDER_REVIEW":
    case "RESUBMITTED":
      return "IN_REVIEW";

    case "CHANGES_REQUESTED":
      return "CHANGES_REQUESTED";

    case "APPROVED":
      return "APPROVED";

    default:
      return report.cell;
  }
}

function reportTitle(report: ReportModel) {
  if (report.type === "MONTHLY")
    return `Relatório mensal ${report.referenceMonth}`;
  return report.type === "PARTIAL" ? "Relatório parcial" : "Relatório final";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function formatMonth(value: string | null) {
  if (!value) return "—";
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ProjectReportsDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { selectedRole } = useAppContext();

  const [project, setProject] = useState<ProjectDetailsModel | null>(null);
  const [data, setData] = useState<ProjectReportsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [uploadReportId, setUploadReportId] = useState<string | null>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

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
          GetReportsProject(projectId),
        ]);
      })
      .then((result) => {
        if (!active || !result) return;
        const [projectData, reportsData] = result;
        setProject(projectData);
        setData(reportsData);
      })
      .catch(() => {
        if (active)
          setError("Não foi possível carregar os relatórios deste projeto.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  const reports = data?.reports ?? [];
  const activeReport = useMemo(
    () => reports.find((report) => report.id === activeReportId) ?? null,
    [reports, activeReportId],
  );
  const uploadReport = useMemo(
    () => reports.find((report) => report.id === uploadReportId) ?? null,
    [reports, uploadReportId],
  );

  function updateReport(updated: ReportModel) {
    setData((current) =>
      current
        ? {
            ...current,
            reports: current.reports.map((item) =>
              item.id === updated.id ? updated : item,
            ),
          }
        : current,
    );
  }

  async function downloadTemplate() {
    setDownloadingTemplate(true);
    setError("");
    try {
      const blob = await DownloadReportTemplate();
      downloadBlob(blob, "modelo-relatorio.docx");
    } catch {
      setError("Não foi possível baixar o modelo de relatório.");
    } finally {
      setDownloadingTemplate(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <p className="py-10 text-center text-sm text-slate-500">
          Carregando relatórios do projeto...
        </p>
      </Card>
    );
  }

  if (!project || !data) {
    return (
      <Card>
        <div className="py-8 text-center">
          <Icon name="search" size={32} />
          <h1 className="mt-3 font-semibold text-slate-800">
            Projeto ou relatórios não encontrados
          </h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Button variant="secondary" onClick={() => navigate("/projects")}>
            Voltar para projetos
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos", onClick: () => navigate("/projects") },
          {
            label: project.title,
            onClick: () => navigate(`/projects/${projectId}`),
          },
          { label: "Relatórios" },
        ]}
      />

      <PageHeader
        title={project.title}
        actions={
          <Button
            variant="secondary"
            icon="download"
            disabled={downloadingTemplate}
            onClick={downloadTemplate}
          >
            {downloadingTemplate ? "Baixando..." : "Baixar modelo"}
          </Button>
        }
      />

      {error && (
        <p
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      {selectedRole === "STUDENT" && !data.canSubmit && (
        <p className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          O envio de relatórios é permitido ao aluno do projeto após a conclusão
          do cadastro. As ações disponíveis dependem das permissões retornadas
          pelo sistema.
        </p>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <strong className="text-sm text-slate-700">Legenda:</strong>
        <Badge tone="success">Aprovado</Badge>
        <Badge tone="warning">Em revisão</Badge>
        <Badge tone="orange">Em ajuste</Badge>
        <Badge tone="danger">Atrasado</Badge>
        <Badge>Prazo não iniciado</Badge>
      </div>

      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            Cronograma de relatórios
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            12 relatórios mensais, relatório parcial e relatório final. Prazos e
            situações são fornecidos pelo sistema.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Relatório</th>
                <th className="px-4 py-3">Mês de referência</th>
                <th className="px-4 py-3">Prazo</th>
                <th className="px-4 py-3">Último envio</th>
                <th className="px-4 py-3">Situação</th>
                <th className="px-4 py-3">Comentário</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => {
                const latestVersion =
                  report.versions[report.versions.length - 1];
                const displayStatus = getReportDisplayStatus(report);
                const tone = getCellTone(displayStatus);
                const canUpload = data.canSubmit && report.acceptsFile;
                const canOpenReview =
                  (data.canReview &&
                    (report.status === "UNDER_REVIEW" ||
                      report.status === "RESUBMITTED")) ||
                  (data.canReopen && report.status === "APPROVED");
                return (
                  <tr
                    key={report.id}
                    className={
                      report.cell === "NOT_DUE"
                        ? "bg-slate-50/70"
                        : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {reportTitle(report)}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatMonth(report.calendarMonth)}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(report.dueDate)}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(latestVersion?.submittedAt ?? null)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone={tone}>{getCellLabel(displayStatus)}</Badge>
                    </td>
                    <td className="max-w-[240px] px-4 py-4 text-slate-600">
                      {latestVersion?.reviewComment ? (
                        <span className="line-clamp-2">
                          {latestVersion.reviewComment}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {canUpload && (
                          <Button
                            icon="upload"
                            onClick={() => setUploadReportId(report.id)}
                          >
                            {report.draft ? "Continuar envio" : "Anexar"}
                          </Button>
                        )}
                        {report.versions.length > 0 && (
                          <Button
                            variant="ghost"
                            onClick={() => setActiveReportId(report.id)}
                          >
                            Histórico
                          </Button>
                        )}
                        {canOpenReview && (
                          <Button
                            variant="secondary"
                            onClick={() => setActiveReportId(report.id)}
                          >
                            {data.canReopen && report.status === "APPROVED"
                              ? "Detalhes / reabrir"
                              : "Revisar"}
                          </Button>
                        )}
                        {!canUpload &&
                          report.versions.length === 0 &&
                          !canOpenReview && (
                            <span className="text-xs text-slate-400">
                              Sem ações disponíveis
                            </span>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Nenhum relatório cadastrado para este projeto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {activeReport && (
        <ReportReview
          report={activeReport}
          canReview={data.canReview}
          canReopen={data.canReopen}
          close={() => setActiveReportId(null)}
          onUpdated={updateReport}
        />
      )}

      {uploadReport && data.canSubmit && (
        <ReportUploadModal
          report={uploadReport}
          close={() => setUploadReportId(null)}
          onUpdated={updateReport}
        />
      )}
    </>
  );
}
