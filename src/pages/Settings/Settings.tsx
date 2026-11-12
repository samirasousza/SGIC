
import { useState } from "react";

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-700">
          Administração
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize as opções gerais de administração do SGIC.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">
          Informações do sistema
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Identificação e informações institucionais.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Sistema</p>
            <p className="mt-1 font-medium text-gray-800">
              SGIC — Sistema de Gestão da Iniciação Científica
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Instituição</p>
            <p className="mt-1 font-medium text-gray-800">
              Universidade do Estado do Amazonas
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">
          Preferências administrativas
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Visualização das opções de administração.
        </p>

        <div className="mt-5 divide-y">
          <label className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Notificações administrativas
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Receber avisos sobre atividades administrativas.
              </span>
            </span>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 accent-blue-700"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Modo de manutenção
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Opção demonstrativa, sem efeito sobre o sistema.
              </span>
            </span>

            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="h-4 w-4 accent-blue-700"
            />
          </label>
        </div>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          As preferências desta tela são temporárias e não são salvas no
          servidor.
        </p>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">
          Administração de acesso
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          O acesso às funcionalidades administrativas é restrito ao perfil
          Administrador.
        </p>

        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          As permissões individuais dos usuários são gerenciadas na seção
          Usuários e permissões.
        </div>
      </section>
    </div>
  );
}
