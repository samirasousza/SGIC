import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { PageHeader } from "../../components/PageHeader";
import { GetProjectDetails } from "../../services/projectService";
import type { ProjectDetailsModel } from "../../models/projectModel";
import type { UserRequestModel } from "../../models/UserRequestsModel";
import { getMyUserRequests } from "../../services/userRequestssService";
import { academicTitleLabels } from "../../utils/translateAcademicTitle";

const statusLabel = {
  PENDING: "Aguardando análise",
  APPROVED: "Cadastrado",
  REJECTED: "Recusado",
} as const;

const statusStyle = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
} as const;

export function MyUserRequestsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [requests, setRequests] = useState<UserRequestModel[]>([]);
  const [project, setProject] = useState<ProjectDetailsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [requestsData, projectData] = await Promise.all([
          getMyUserRequests(),
          projectId ? GetProjectDetails(projectId) : Promise.resolve(null),
        ]);

        if (active) {
          setRequests(requestsData);
          setProject(projectData);
        }
      } catch {
        if (active) setError("Não foi possível carregar as solicitações.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [projectId]);

  // Com projeto: Início > Projetos > Projeto > Banca > Solicitações
  // Sem projeto (acesso direto): Início > Solicitações
  const breadcrumbItems = project
    ? [
        { label: "Início", onClick: () => navigate("/") },
        { label: "Projetos", onClick: () => navigate("/projects") },
        {
          label: project.title,
          onClick: () => navigate(`/projects/${project.id}`),
        },
        {
          label: "Banca",
          onClick: () => navigate(`/projects/${project.id}/evaluators`),
        },
        { label: "Minhas solicitações de cadastro" },
      ]
    : [
        { label: "Início", onClick: () => navigate("/") },
        { label: "Minhas solicitações de cadastro" },
      ];

  return (
    <div className="space-y-5">
      <Breadcrumbs items={breadcrumbItems} />

      <PageHeader
        title="Minhas solicitações de cadastro"
        description="Acompanhe os pedidos de cadastro de avaliadores externos."
      />

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <Card>
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Carregando...
          </p>
        ) : !requests.length ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Você ainda não fez nenhuma solicitação.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {requests.map((r) => (
              <li key={r.id} className="space-y-1 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-800">{r.name}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[r.status]}`}
                  >
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {r.email}
                  {r.academicTitle
                    ? ` · ${academicTitleLabels[r.academicTitle]}`
                    : ""}
                  {r.institution ? ` · ${r.institution}` : ""}
                </p>
                {r.project && (
                  <p className="text-xs text-slate-500">
                    Projeto: {r.project.title}
                  </p>
                )}
                <p className="text-xs text-slate-500">Motivo: {r.reason}</p>
                <p className="text-xs text-slate-400">
                  Solicitado em{" "}
                  {new Date(r.requestedAt).toLocaleDateString("pt-BR")}
                  {r.reviewedAt &&
                    ` · analisado em ${new Date(r.reviewedAt).toLocaleDateString("pt-BR")}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
