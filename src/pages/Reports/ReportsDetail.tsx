import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Role } from "../Login/LoginTypes";
import { projectRows } from "../Projects/ProjectsData";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { UploadModal } from "../../components/UploadModal";
import { ReportReview } from "../../components/Reports/ReportReview";

interface ProjectReportsDetailProps {
  role: Role;
}

type ReportTone = "success" | "warning" | "orange" | "danger" | "neutral";

interface ReportItem {
  name: string;
  due: string;
  status: string;
  tone: ReportTone;
}

const reportItems: ReportItem[] = [
  {
    name: "Relatório mensal 1",
    due: "25 set 2025",
    status: "Aprovado",
    tone: "success",
  },
  {
    name: "Relatório mensal 2",
    due: "25 out 2025",
    status: "Aprovado",
    tone: "success",
  },
  {
    name: "Relatório mensal 3",
    due: "25 nov 2025",
    status: "Aprovado",
    tone: "success",
  },
  {
    name: "Relatório mensal 4",
    due: "25 jan 2026",
    status: "Aprovado",
    tone: "success",
  },
  {
    name: "Relatório mensal 5",
    due: "25 fev 2026",
    status: "Aprovado",
    tone: "success",
  },
  {
    name: "Relatório parcial",
    due: "25 mar 2026",
    status: "Ajustes solicitados",
    tone: "warning",
  },
  {
    name: "Relatório mensal 6",
    due: "25 mar 2026",
    status: "Pendente",
    tone: "orange",
  },
  {
    name: "Relatório mensal 7",
    due: "25 abr 2026",
    status: "Não liberado",
    tone: "neutral",
  },
  {
    name: "Relatório mensal 8",
    due: "25 mai 2026",
    status: "Não liberado",
    tone: "neutral",
  },
  {
    name: "Relatório mensal 9",
    due: "25 jun 2026",
    status: "Não liberado",
    tone: "neutral",
  },
  {
    name: "Relatório mensal 10",
    due: "25 jul 2026",
    status: "Não liberado",
    tone: "neutral",
  },
  {
    name: "Relatório mensal 11",
    due: "25 ago 2026",
    status: "Não liberado",
    tone: "neutral",
  },
  {
    name: "Relatório mensal 12",
    due: "25 set 2026",
    status: "Não liberado",
    tone: "neutral",
  },
  {
    name: "Relatório final",
    due: "25 set 2026",
    status: "Não liberado",
    tone: "neutral",
  },
];

export function ProjectReportsDetail({ role }: ProjectReportsDetailProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = projectRows.find((item) => String(item.id) === projectId);

  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!project) {
    return (
      <Card>
        <div className="py-8 text-center">
          <Icon name="search" size={32} />
          <h1 className="mt-3 font-semibold text-slate-800">
            Projeto não encontrado
          </h1>
          <Button variant="secondary" onClick={() => navigate("/project")}>
            Voltar para projetos
          </Button>
        </div>
      </Card>
    );
  }

  const archived = project.cycle === "2024–2025";
  const items = archived
    ? reportItems.map((item) => ({
        ...item,
        status: "Aprovado",
        tone: "success" as const,
      }))
    : reportItems;

  //   const pageSize = 10;
  //   const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Projetos", onClick: () => navigate("/project") },
          {
            label: project.title,
            onClick: () => navigate(`/projects/${projectId}`),
          },
          { label: "Relatórios" },
        ]}
      />

      <button
        type="button"
        onClick={() => navigate(`/projects/${projectId}`)}
        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <Icon name="arrow" size={16} />
        Voltar para o projeto
      </button>

      <PageHeader
        title={project.title}
        description={`${project.student} • Orientador: Prof. Dr. ${project.advisor}`}
        actions={
          role === "Aluno" && !archived ? (
            <Button icon="upload" onClick={() => setUploading(true)}>
              Anexar relatório do mês atual
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-3 pb-8">
        <strong className="text-sm text-slate-700">Legenda:</strong>
        <Badge tone="success">Aprovado</Badge>
        <Badge tone="warning">Em análise ou ajustes</Badge>
        <Badge tone="orange">Pendente</Badge>
        <Badge tone="danger">Atrasado</Badge>
        <Badge>Não disponível</Badge>
      </div>

      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            Cronograma completo
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            12 relatórios mensais, relatório parcial e relatório final. Itens em
            cinza ainda não foram liberados.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Relatório</th>
                <th className="px-4 py-3">Prazo</th>
                <th className="px-4 py-3">Envio</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Comentário</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => {
                const unavailable = item.tone === "neutral";
                const sent = archived || index < 6;

                return (
                  <tr
                    key={item.name}
                    className={
                      unavailable
                        ? "bg-slate-50 text-slate-400"
                        : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {item.name}
                    </td>

                    <td className="px-4 py-4 text-slate-600">{item.due}</td>

                    <td className="px-4 py-4 text-slate-600">
                      {sent
                        ? `22 ${item.due.split(" ").slice(1).join(" ")}`
                        : "—"}
                    </td>

                    <td className="px-4 py-4">
                      <Badge tone={item.tone}>{item.status}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      {item.status === "Ajustes solicitados" ? (
                        <button
                          type="button"
                          onClick={() => setActiveReport(item.name)}
                          className="cursor-pointer text-indigo-600 hover:underline"
                        >
                          1 comentário do orientador
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {unavailable ? (
                        <span className="text-xs text-slate-400">
                          Não liberado
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          {sent && (
                            <button
                              type="button"
                              className="cursor-pointer inline-flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600"
                            >
                              <Icon name="download" size={15} />
                              Baixar
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                item.status === "Pendente" &&
                                role === "Aluno"
                              ) {
                                setUploading(true);
                              } else {
                                setActiveReport(item.name);
                              }
                            }}
                            className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            {item.status === "Ajustes solicitados"
                              ? "Ver ajustes"
                              : item.status === "Pendente" && role === "Aluno"
                                ? "Anexar"
                                : sent
                                  ? "Abrir"
                                  : "Detalhes"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {activeReport && (
        <ReportReview
          role={role}
          name={activeReport}
          archived={archived}
          close={() => setActiveReport(null)}
          uploading={() => setUploading(true)}
        />
      )}

      {uploading && <UploadModal close={() => setUploading(false)} />}
    </>
  );
}
