import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { ProjectDataField } from "../../components/Projects/ProjectDataField";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";

import { GetProjectDetails } from "../../services/projectService";
import type { ProjectDetailsModel } from "../../models/projectModel";

const programLabels: Record<string, string> = {
  PAIC: "PAIC — Programa de Apoio à Iniciação Científica",
  PIBIC: "PIBIC — Programa Institucional de Bolsas de Iniciação Científica",
  PIBIC_AF: "PIBIC-AF",
  PIBITI:
    "PIBITI — Programa Institucional de Bolsas de Iniciação em Desenvolvimento Tecnológico e Inovação",
  PBICT_AF: "PBICT-AF",
  VOLUNTEER: "Voluntário",
};

const scholarshipLabels: Record<string, string> = {
  SCHOLARSHIP_HOLDER: "Bolsista",
  VOLUNTEER: "Voluntário",
};

function formatDate(date?: string | null) {
  if (!date) return "Não informado";

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatBoolean(value?: boolean | null) {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return "Não informado";
}

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetailsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      if (!projectId) {
        setError("Identificador do projeto não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await GetProjectDetails(projectId);

        if (active) {
          setProject(data);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do projeto:", error);

        if (active) {
          setError("Não foi possível carregar os dados do projeto.");
          setProject(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-5">
        <Card>
          <div className="py-12 text-center text-sm text-slate-500">
            Carregando dados do projeto...
          </div>
        </Card>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-5">
        <Card>
          <div className="py-8 text-center">
            <h1 className="mt-3 text-lg font-semibold text-slate-800">
              Projeto não encontrado
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Não foi possível encontrar o projeto solicitado."}
            </p>

            <Button className="mt-5" onClick={() => navigate("/project")}>
              Voltar para projetos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumbs
        items={[
          {
            label: "Início",
            onClick: () => navigate("/"),
          },
          {
            label: "Projetos",
            onClick: () => navigate("/project"),
          },
          {
            label: project.title,
          },
        ]}
      />

      {/* Cabeçalho */}
      <PageHeader
        title={project.title}
        description={`${project.student.name} • Orientador: ${project.advisor.name}`}
      />

      {/* Atalhos para as funcionalidades do projeto */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/reports`)}
          className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon name="file" size={20} />
          </span>

          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-semibold text-slate-800">
              Relatórios do projeto
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              Consultar relatórios e entregas
            </small>
          </span>

          <Icon name="arrow" size={18} />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/evaluations`)}
          className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon name="clipboard" size={20} />
          </span>

          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-semibold text-slate-800">
              Avaliações do projeto
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              Consultar avaliações parcial e final
            </small>
          </span>

          <Icon name="arrow" size={18} />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/evaluators`)}
          className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Icon name="users" size={20} />
          </span>

          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-semibold text-slate-800">
              Banca do projeto
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              Consultar ou gerenciar a composição da banca
            </small>
          </span>

          <Icon name="arrow" size={18} />
        </button>
      </div>

      {/* Dados do projeto */}
      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            Dados do projeto
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectDataField
            label="Nº SISPROJ"
            value={project.sisprojNumber || "Não informado"}
          />

          <ProjectDataField label="Título" value={project.title} />

          <ProjectDataField
            label="Programa"
            value={programLabels[project.program] ?? project.program}
          />

          <ProjectDataField
            label="Tipo de bolsa"
            value={
              scholarshipLabels[project.scholarshipType] ??
              project.scholarshipType
            }
          />

          <ProjectDataField
            label="Edital"
            value={project.noticeNumber || "Não informado"}
          />

          <ProjectDataField label="Ciclo" value={project.cycle} />

          <ProjectDataField
            label="Unidade acadêmica"
            value={`${project.unit.name} (${project.unit.acronym})`}
          />

          <ProjectDataField label="Orientador" value={project.advisor.name} />

          <ProjectDataField
            label="E-mail do orientador"
            value={project.advisor.email || "Não informado"}
          />

          <ProjectDataField
            label="Coorientador"
            value={project.coAdvisor?.name || "Não informado"}
          />

          <ProjectDataField
            label="E-mail do coorientador"
            value={project.coAdvisor?.email || "Não informado"}
          />

          <ProjectDataField
            label="Data de início"
            value={formatDate(project.startDate)}
          />

          <ProjectDataField
            label="Data de término"
            value={formatDate(project.endDate)}
          />

          <ProjectDataField
            label="Vigência"
            value={
              project.durationMonths
                ? `${project.durationMonths} meses`
                : "Não informado"
            }
          />

          <ProjectDataField
            label="Área"
            value={project.area || "Não informado"}
          />

          <ProjectDataField
            label="Subárea"
            value={project.subarea || "Não informado"}
          />
        </div>
      </Card>

      {/* Dados do aluno */}
      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            Dados do aluno
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Informações do cadastro complementar do estudante.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectDataField label="Nome" value={project.student.name} />

          <ProjectDataField
            label="E-mail"
            value={project.student.email || "Não informado"}
          />

          <ProjectDataField
            label="CPF"
            value={project.student.cpf || "Não informado"}
          />

          <ProjectDataField
            label="Matrícula"
            value={project.student.registration || "Não informado"}
          />

          <ProjectDataField
            label="Curso"
            value={project.student.course?.name || "Não informado"}
          />

          <ProjectDataField
            label="Unidade do curso"
            value={
              project.student.course?.unit
                ? `${project.student.course.unit.name} (${project.student.course.unit.acronym})`
                : "Não informado"
            }
          />

          <ProjectDataField
            label="Telefone"
            value={project.student.phone || "Não informado"}
          />

          <ProjectDataField
            label="Pessoa com deficiência (PcD)"
            value={formatBoolean(project.student.pcd)}
          />

          <ProjectDataField
            label="Possui graduação"
            value={formatBoolean(project.student.hasDegree)}
          />
        </div>
      </Card>

      {/* Resumo do projeto */}
      <Card>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            Resumo do projeto
          </h2>
        </div>

        <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
          {project.summary || "Nenhum resumo informado para este projeto."}
        </p>
      </Card>
    </div>
  );
}
