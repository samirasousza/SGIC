import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { ProjectDataField } from "../../components/ProjectDataField";

import { projectRows } from "./ProjectsData";
import { Badge } from "../../components/Badge";
import { PageHeader } from "../../components/PageHeader";

interface ComplementaryData {
  cpf: string;
  course: string;
  phone: string;
  pcd: string;
  degree: string;
}

const initialComplementaryData: ComplementaryData = {
  cpf: "",
  course: "",
  phone: "",
  pcd: "",
  degree: "",
};

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = projectRows.find((item) => String(item.id) === projectId);

  const [complementary, setComplementary] = useState<ComplementaryData>(
    initialComplementaryData,
  );

  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  if (!project) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate("/project")}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
        >
          <Icon name="arrow" size={16} />
          Voltar para projetos
        </button>

        <Card>
          <div className="py-8 text-center">
            <Icon name="search" size={32} />
            <h1 className="mt-3 text-lg font-semibold text-slate-800">
              Projeto não encontrado
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Não foi possível encontrar o projeto solicitado.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const archived = project.cycle === "2024–2025";

  const requiredComplete = Boolean(
    complementary.cpf.trim() &&
    complementary.course.trim() &&
    complementary.phone.trim(),
  );

  const updateComplementary = (
    field: keyof ComplementaryData,
    value: string,
  ) => {
    setComplementary((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!requiredComplete) return;

    setSaved(true);
    setEditing(false);
  };

  const statusClass = archived
    ? "border-slate-200 bg-slate-100 text-slate-600"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";

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
            onClick: () => navigate("/projetos"),
          },
          {
            label: project.title,
          },
        ]}
      />

      <button
        type="button"
        onClick={() => navigate("/project")}
        className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
      >
        <Icon name="arrow" size={16} />
        Voltar para projetos
      </button>

      {/* Cabeçalho */}
      <PageHeader
        title={project.title}
        description={`${project.student} • Orientador: Prof. Dr. ${project.advisor}`}
        actions={
          <Badge tone={archived ? "neutral" : "success"} className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {project.status}
          </Badge>
        }
      />

      {/* Atalhos para as funcionalidades do projeto */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/reports`)}
          className="cursor-pointer group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon name="file" size={20} />
          </span>

          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-semibold text-slate-800">
              Relatórios do projeto
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              {archived
                ? "14 de 14 relatórios aprovados"
                : "5 aprovados • 1 requer ajustes"}
            </small>
          </span>

          <Icon
            name="arrow"
            size={18}
            // className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
          />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/evaluations`)}
          className="cursor-pointer group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon name="clipboard" size={20} />
          </span>

          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-semibold text-slate-800">
              Avaliações do projeto
            </strong>
            <small className="mt-1 block text-xs text-slate-500">
              {archived
                ? "Parcial e final concluídas"
                : "Parcial disponível • Final futura"}
            </small>
          </span>

          <Icon
            name="arrow"
            size={18}
            // className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
          />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/evaluators`)}
          className="cursor-pointer group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
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

          <Icon
            name="arrow"
            size={18}
            // className= "shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600"
          />
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Informações importadas */}
          <Card>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Dados do projeto
                </h2>
                {/* <p className="mt-1 text-sm text-slate-500">
                  Dados oficiais do projeto no SISPROJ
                </p> */}
              </div>

              {/* <span className="w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                Somente leitura
              </span> */}
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-lg bg-sky-50 p-3 text-sky-700">
              <span className="mt-0.5 shrink-0">
                <Icon name="info" size={18} />
              </span>

              <p className="text-sm leading-relaxed text-slate-600">
                Estes dados são importados do SISPROJ.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <ProjectDataField
                label="Nº SISPROJ"
                value={archived ? "39126/2024" : "48271/2025"}
              />

              <ProjectDataField label="Título" value={project.title} />

              <ProjectDataField
                label="Tipo de bolsa/programa"
                value="PAIC — Programa de Apoio à Iniciação Científica"
              />

              <ProjectDataField
                label="Edital"
                value={
                  archived
                    ? "Edital nº 038/2024 — PROPESP/UEA"
                    : "Edital nº 042/2025 — PROPESP/UEA"
                }
              />

              <ProjectDataField label="Ciclo" value={project.cycle} />

              <ProjectDataField
                label="Unidade acadêmica"
                value="Escola Superior de Tecnologia"
              />

              <ProjectDataField
                label="Orientador"
                value={`Prof. Dr. ${project.advisor}`}
              />

              <ProjectDataField label="Coorientador" value="Não informado" />

              <ProjectDataField label="Aluno" value={project.student} />

              <ProjectDataField label="Matrícula" value="22150184" />

              <ProjectDataField
                label="Data de início"
                value={archived ? "01 ago 2024" : "01 ago 2025"}
              />

              <ProjectDataField
                label="Data de término"
                value={archived ? "31 jul 2025" : "31 jul 2026"}
              />

              {/* <ProjectDataField label="Vigência" value="12 meses" /> */}

              <ProjectDataField label="Área" value="Ciências Biológicas" />

              <ProjectDataField
                label="Subárea"
                value="Ecologia de Ecossistemas"
              />
            </div>
          </Card>

          {/* Cadastro complementar */}
          <Card>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Cadastro complementar do aluno
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dados exigidos no primeiro acesso e na ficha da banca
                </p>
              </div>

              {saved ? (
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Completo
                </span>
              ) : (
                <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Aguardando preenchimento
                </span>
              )}
            </div>

            {!archived && (!saved || editing) ? (
              <form
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSave();
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    CPF <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={complementary.cpf}
                    onChange={(event) =>
                      updateComplementary("cpf", event.target.value)
                    }
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    required
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Curso <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={complementary.course}
                    onChange={(event) =>
                      updateComplementary("course", event.target.value)
                    }
                    required
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Selecione seu curso
                    </option>
                    <option>Ciências Biológicas</option>
                    <option>Engenharia Ambiental</option>
                    <option>Engenharia Florestal</option>
                    <option>Química</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Telefone <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={complementary.phone}
                    onChange={(event) =>
                      updateComplementary("phone", event.target.value)
                    }
                    placeholder="(92) 99999-9999"
                    inputMode="tel"
                    required
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Pessoa com deficiência (PcD)
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      Opcional
                    </span>
                  </span>
                  <select
                    value={complementary.pcd}
                    onChange={(event) =>
                      updateComplementary("pcd", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Prefiro não informar</option>
                    <option>Não</option>
                    <option>Sim</option>
                  </select>
                </label>

                {/* <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Possui graduação?
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      Opcional
                    </span>
                  </span>
                  <select
                    value={complementary.degree}
                    onChange={(event) =>
                      updateComplementary("degree", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Prefiro não informar</option>
                    <option>Não</option>
                    <option>Sim</option>
                  </select>
                </label> */}

                <div className="col-span-full flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-slate-500">
                    * Campos obrigatórios
                  </span>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    {editing && (
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!requiredComplete}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon name="check" size={16} />
                      Salvar cadastro complementar
                    </button>
                  </div>
                </div>
              </form>
            ) : saved ? (
              <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                  <ProjectDataField label="CPF" value={complementary.cpf} />
                  <ProjectDataField
                    label="Curso"
                    value={complementary.course}
                  />
                  <ProjectDataField
                    label="Telefone"
                    value={complementary.phone}
                  />
                  <ProjectDataField
                    label="Pessoa com deficiência (PcD)"
                    value={complementary.pcd || "Não informado"}
                  />
                  <ProjectDataField
                    label="Possui graduação"
                    value={complementary.degree || "Não informado"}
                  />
                </div>

                {!archived && (
                  <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Editar dados
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <span className="mt-0.5 text-slate-400">
                  <Icon name="clock" size={20} />
                </span>
                <div>
                  <strong className="text-sm font-semibold text-slate-800">
                    Dados ainda não preenchidos
                  </strong>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    O cadastro complementar ainda não foi preenchido.
                  </p>
                </div>
              </div>
            )}

            {saved && !editing && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                <Icon name="check" size={16} />
                <span>
                  Cadastro complementar salvo nesta sessão para consulta.
                </span>
              </div>
            )}
          </Card>

          {/* Resumo do projeto */}
          <Card>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-800">
                Resumo do projeto
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Descrição cadastrada no plano de trabalho
              </p>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              O projeto investiga a diversidade e a distribuição de insetos
              aquáticos em igarapés urbanos e preservados da região de Manaus,
              buscando identificar indicadores biológicos de qualidade ambiental
              e contribuir para estratégias de conservação dos ecossistemas
              amazônicos.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Entomologia",
                "Biodiversidade",
                "Amazônia",
                "Biomonitoramento",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
