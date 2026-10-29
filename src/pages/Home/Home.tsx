import { useNavigate } from "react-router";
import { Icon } from "../../components/Icon";
import { Card } from "../../components/Card";
import { PageHeader } from "../../components/PageHeader";
import {
  navByRole,
  profileName,
  type Role,
  type Screen,
} from "../Login/LoginTypes";

const homeCardDescriptions: Partial<Record<Screen, string>> = {
  project:
    "Consulte os projetos vinculados ao seu perfil e acesse documentos, equipe e dados acadêmicos.",
  "unit-projects":
    "Acompanhe os projetos da unidade com filtros por curso, bolsa e situação.",
  reports: "Consulte o status dos relatórios e identifique entregas pendentes.",
  "review-boards":
    "Acompanhe as fichas de avaliação das defesas parcial e final.",
  boards:
    "Consulte os projetos em que você atua como avaliador e preencha as fichas disponíveis.",
  spreadsheets:
    "Gere e exporte as planilhas oficiais consolidadas do programa.",
  users: "Cadastre usuários, atribua perfis e gerencie permissões de acesso.",
  settings:
    "Configure ciclos, períodos de avaliação, prazos e lembretes automáticos.",
};

const role: Role = "Aluno";
const accountRole: Role = "Aluno";
const cycle = "2025–2026";

export function HomePage() {
  const navigate = useNavigate();

  const destinations = navByRole[role].filter(
    (item) => item.screen !== "overview",
  );

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow={`Ciclo ${cycle}`}
        title={`Olá, ${profileName(accountRole)}`}
        description="Escolha uma área para começar. Os acessos abaixo correspondem aos acessos rápidos."
      />

      {/* Apresentação
      <section className="flex flex-col gap-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            Seu ambiente de trabalho
          </span>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            O que você deseja acompanhar hoje?
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Acesse diretamente cada módulo disponível para o seu papel no SGIC.
          </p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <Icon name="user" size={20} />
          </span>

          <div>
            <span className="block text-xs text-gray-500">
              Visualização atual
            </span>
            <strong className="text-sm text-gray-900">
              {role === "Orientador e avaliador" ? "Orientador" : role}
            </strong>
          </div>
        </div>
      </section> */}

      {/* Módulos disponíveis */}
      <section>
        {/* <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Acessos rápidos</h2>
          <p className="text-sm text-gray-500">
            Selecione um módulo para consultar informações e realizar ações.
          </p>
        </div> */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((item, index) => {
            const iconStyles = [
              "bg-blue-100 text-blue-700",
              "bg-emerald-100 text-emerald-700",
              "bg-violet-100 text-violet-700",
            ];

            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => navigate(item.screen)}
                className="cursor-pointer group flex min-h-64 flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <div className="flex w-full items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      iconStyles[index % iconStyles.length]
                    }`}
                  >
                    <Icon name={item.icon} size={24} />
                  </span>

                  {/* <span className="text-xs font-medium tracking-wide text-gray-400">
                    ÁREA {String(index + 1).padStart(2, "0")}
                  </span> */}
                </div>

                <div className="mt-5 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-blue-700">
                    {item.label}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {homeCardDescriptions[item.screen] ??
                      "Acesse as informações e ações disponíveis nesta área."}
                  </p>
                </div>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Acessar área
                  <span className="transition-transform group-hover:translate-x-1">
                    <Icon name="arrow" size={16} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {destinations.length === 0 && (
          <Card className="py-12 text-center">
            <div className="flex flex-col items-center">
              <Icon name="folder" size={32} />
              <h3 className="mt-4 font-semibold text-gray-900">
                Nenhum módulo disponível
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Não há áreas de acesso configuradas para este perfil.
              </p>
            </div>
          </Card>
        )}
      </section>
    </main>
  );
}
