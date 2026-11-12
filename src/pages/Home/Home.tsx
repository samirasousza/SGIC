import { Icon } from "../../components/Icon";
import { Card } from "../../components/Card";
import { PageHeader } from "../../components/PageHeader";
import { useUser } from "../../contexts/userContext";
import { useAppContext } from "../../contexts/appContext";
import { useNavigate } from "react-router-dom";
import { getNavigationOptions, getScreenPath } from "../../utils/navigation";
import type { Screen } from "../../types/screenType";

const homeCardDescriptions: Partial<Record<Screen, string>> = {
  projects:
    "Consulte os projetos vinculados ao seu perfil e acesse documentos, equipe e dados acadêmicos.",
  reports: "Consulte o status dos relatórios e identifique entregas pendentes.",
  evaluations: "Consulte as avaliações disponíveis para sua função no sistema.",
  evaluators: "Consulte e gerencie os avaliadores vinculados aos projetos.",
  spreadsheets:
    "Gere e exporte as planilhas oficiais consolidadas do programa.",
  users: "Cadastre usuários, atribua perfis e gerencie permissões de acesso.",
  settings:
    "Configure ciclos, períodos de avaliação, prazos e lembretes automáticos.",
};

export function HomePage() {
  const navigate = useNavigate();

  const { user } = useUser();
  const { selectedRole, cycle } = useAppContext();

  const destinations = getNavigationOptions(selectedRole).filter(
    (item) => item.screen !== "",
  );

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow={`Ciclo ${cycle}`}
        title={`Olá, ${user?.name ?? "usuário"}`}
        description="Escolha uma área para começar. Os acessos abaixo correspondem aos acessos rápidos."
      />

      <section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((item, index) => {
            const iconStyles = [
              "bg-blue-100 text-blue-700",
              "bg-emerald-100 text-emerald-700",
              "bg-violet-100 text-violet-700",
            ];

            const description =
              item.screen === "projects" && selectedRole === "LOCAL_COMMITTEE"
                ? "Acompanhe os projetos da unidade com filtros por curso, bolsa e situação."
                : item.screen === "projects" &&
                    selectedRole === "TECHNICAL_SUPPORT"
                  ? "Acompanhe os projetos da unidade e consulte suas informações."
                  : (homeCardDescriptions[item.screen] ??
                    "Acesse as informações e ações disponíveis nesta área.");

            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => navigate(getScreenPath(item.screen))}
                className="group flex min-h-64 cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <div className="flex w-full items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      iconStyles[index % iconStyles.length]
                    }`}
                  >
                    <Icon name={item.icon} size={24} />
                  </span>
                </div>

                <div className="mt-5 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-blue-700">
                    {item.label}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {description}
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
