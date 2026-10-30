import type { Role } from "../pages/Login/LoginTypes";
import { Button } from "./Button";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { Metric } from "./Metric";
import { PageHeader } from "./PageHeader";

export function ManagementOverview({
  role,
}: {
  role: Role;
  navigate: (screen: Screen) => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Ciclo 2025–2026"
        title={
          role === "Administrador"
            ? "Painel administrativo"
            : "Gestão acadêmica"
        }
        description="Visão consolidada do Programa de Iniciação Científica."
        actions={
          <Button variant="secondary" icon="download">
            Exportar relatório
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon="users"
          value="428"
          label="Alunos ativos"
          detail="+12% no ciclo atual"
          tone="green"
        />
        <Metric
          icon="folder"
          value="397"
          label="Projetos em andamento"
          detail="31 unidades acadêmicas"
        />
        <Metric
          icon="users"
          value="286"
          label="Orientadores"
          detail="Com vínculo ativo"
        />
        <Metric
          icon="clipboard"
          value="92%"
          label="Entregas no prazo"
          detail="Média do ciclo"
          tone="green"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2>Progresso das entregas</h2>
              <p>Distribuição por situação no ciclo atual</p>
            </div>
            <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option>Todos os cursos</option>
            </select>
          </div>
          <div className="flex h-56 items-end justify-between gap-3">
  {[
    ["Ago", 88],
    ["Set", 94],
    ["Out", 91],
    ["Nov", 96],
    ["Jan", 89],
    ["Fev", 93],
    ["Mar", 68],
  ].map(([month, value]) => (
    <div key={month} className="flex flex-col items-center gap-2">
      <div className="flex h-44 w-8 items-end rounded-full bg-gray-100">
        <div
          className="w-full rounded-full bg-blue-600"
          style={{ height: `${value}%` }}
        />
      </div>

      <small className="text-gray-500">{month}</small>
    </div>
  ))}
</div>
          <div className="mt-5 flex items-center justify-between text-sm">
  <span className="flex items-center gap-2">
    <span className="h-3 w-3 rounded-full bg-blue-600" />
    Entregas concluídas
  </span>

  <strong>Meta: 90%</strong>
</div>
        </Card>
        <Card>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2>Atenção necessária</h2>
              <p>Pendências que exigem ação</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50">
              <span className="attention-icon orange">
                <Icon name="file" />
              </span>
              <span>
                <strong>18 relatórios atrasados</strong>
                <small>Em 12 projetos</small>
              </span>
              <Icon name="arrow" />
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50">
              <span className="attention-icon yellow">
                <Icon name="users" />
              </span>
              <span>
                <strong>7 bancas sem avaliador</strong>
                <small>Próximos 30 dias</small>
              </span>
              <Icon name="arrow" />
            </button>
            <button>
              <span className="attention-icon red">
                <Icon name="clock" />
              </span>
              <span>
                <strong>4 projetos com pendência</strong>
                <small>Dados cadastrais incompletos</small>
              </span>
              <Icon name="arrow" />
            </button>
          </div>
        </Card>
      </div>
      <Card>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2>Atividade recente</h2>
            <p>Últimas movimentações no sistema</p>
          </div>
          <Button variant="ghost">
            Ver histórico <Icon name="arrow" size={16} />
          </Button>
        </div>
        <div className="activity-feed">
          {[
            "Relatório parcial enviado por Ana Martins",
            "Banca final agendada para Lucas Almeida",
            "Projeto de Júlia Souza atualizado",
            "Novo orientador vinculado à unidade EST",
          ].map((item, index) => (
            <div key={item}>
              <span className={`feed-dot feed-${index}`} />
              <div>
                <strong>{item}</strong>
                <small>
                  {index === 0
                    ? "Há 12 minutos"
                    : index === 1
                      ? "Há 35 minutos"
                      : `Há ${index + 1} horas`}
                </small>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
