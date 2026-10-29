
import type { Screen } from "../pages/Login/LoginTypes";
import { Icon } from "./Icon";

interface NotificationsPanelProps {
  close: () => void;
  navigate: (screen: Screen) => void;
}

export function NotificationsPanel({
  close,
  navigate,
}: NotificationsPanelProps) {
  const notifications = [
    {
      title: "Ajustes solicitados no relatório parcial",
      description: "O orientador adicionou um comentário à versão 2.",
      time: "Há 18 minutos",
      icon: "file",
      screen: "reports" as Screen,
      unread: true,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Avaliação parcial disponível",
      description: "O formulário já pode ser preenchido.",
      time: "Hoje, 08h30",
      icon: "clipboard",
      screen: "project-evaluations" as Screen,
      unread: false,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Dados do projeto atualizados",
      description: "As alterações foram registradas no ciclo 2025–2026.",
      time: "Ontem, 16h12",
      icon: "folder",
      screen: "project" as Screen,
      unread: false,
      color: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar notificações"
        onClick={close}
        className="absolute inset-0 bg-slate-950/40"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Central
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Notificações
            </h2>
          </div>

          <button
            type="button"
            aria-label="Fechar"
            onClick={close}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.title}
              type="button"
              onClick={() => navigate(notification.screen)}
              className="flex w-full gap-4 border-b border-slate-100 px-6 py-5 text-left transition hover:bg-slate-50"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${notification.color}`}
              >
                <Icon name={notification.icon} size={20} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-start gap-2">
                  <span className="flex-1 text-sm font-semibold text-slate-800">
                    {notification.title}
                  </span>

                  {notification.unread && (
                    <span
                      aria-label="Não lida"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600"
                    />
                  )}
                </span>

                <span className="mt-1 block text-sm leading-5 text-slate-500">
                  {notification.description}
                </span>

                <span className="mt-2 block text-xs text-slate-400">
                  {notification.time}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={close}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Fechar notificações
          </button>
        </div>
      </aside>
    </div>
  );
}
