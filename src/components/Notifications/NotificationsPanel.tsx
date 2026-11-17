import { useCallback, useEffect, useState } from "react";
import { Icon } from "../Icon";
import {
  GetNotifications,
  GetNotificationsPreferences,
  PostAllNotificationsReaded,
  PostNotificationsReaded,
  PutNotificationsPreferences,
} from "../../services/notificationsService";
import type {
  NotificationModel,
  NotificationPreferenceModel,
} from "../../models/notificationModel";

interface NotificationsPanelProps {
  close: () => void;
  navigate: (path: string) => void;
  onNotificationsChanged?: () => void;
}

const PAGE_SIZE = 20;

type NotificationVisual = {
  icon: string;
  color: string;
};

const notificationVisuals: Record<string, NotificationVisual> = {
  REPORT_DUE_SOON: { icon: "clock", color: "bg-amber-50 text-amber-600" },
  REPORT_OVERDUE: { icon: "clock", color: "bg-rose-50 text-rose-600" },
  REPORT_REVIEW_PENDING: {
    icon: "file",
    color: "bg-indigo-50 text-indigo-600",
  },
  EVALUATION_PENDING: {
    icon: "clipboard",
    color: "bg-emerald-50 text-emerald-600",
  },
  REPORT_SUBMITTED: { icon: "file", color: "bg-indigo-50 text-indigo-600" },
  REPORT_APPROVED: { icon: "check", color: "bg-emerald-50 text-emerald-600" },
  REPORT_CHANGES_REQUESTED: {
    icon: "file",
    color: "bg-amber-50 text-amber-600",
  },
  REPORT_REOPENED: { icon: "file", color: "bg-orange-50 text-orange-600" },
  BOARD_ASSIGNED: { icon: "calendar", color: "bg-violet-50 text-violet-600" },
  BOARD_MEMBER_REMOVED: { icon: "users", color: "bg-slate-100 text-slate-600" },
  EVALUATION_REOPENED: {
    icon: "clipboard",
    color: "bg-orange-50 text-orange-600",
  },
};

function formatNotificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const notificationDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  if (notificationDay.getTime() === today.getTime()) return `Hoje, ${time}`;
  if (notificationDay.getTime() === yesterday.getTime())
    return `Ontem, ${time}`;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function NotificationsPanel({
  close,
  navigate,
  onNotificationsChanged,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferenceModel[]>(
    [],
  );
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesSuccess, setPreferencesSuccess] = useState(false);

  async function openPreferences() {
    setPreferencesOpen(true);
    setLoadingPreferences(true);
    setPreferencesError("");
    setPreferencesSuccess(false);
    try {
      setPreferences(await GetNotificationsPreferences());
    } catch {
      setPreferencesError("Não foi possível carregar suas preferências.");
    } finally {
      setLoadingPreferences(false);
    }
  }

  async function savePreferences() {
    setSavingPreferences(true);
    setPreferencesError("");
    setPreferencesSuccess(false);
    try {
      const emailDisabled = preferences
        .filter((item) => !item.mandatory && !item.emailEnabled)
        .map((item) => item.type);
      setPreferences(await PutNotificationsPreferences({ emailDisabled }));
      setPreferencesSuccess(true);
    } catch {
      setPreferencesError("Não foi possível salvar suas preferências.");
    } finally {
      setSavingPreferences(false);
    }
  }

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await GetNotifications({
        unreadOnly,
        page,
        size: PAGE_SIZE,
      });
      setNotifications(response.content ?? []);
      setTotalPages(response.page?.totalPages ?? 0);
      setTotalElements(response.page?.totalElements ?? 0);
    } catch {
      setError("Não foi possível carregar as notificações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [page, unreadOnly]);

  useEffect(() => {
    let active = true;

    async function fetchNotifications() {
      if (!active) return;
      await loadNotifications();
    }

    void fetchNotifications();

    return () => {
      active = false;
    };
  }, [loadNotifications]);

  function changeFilter(nextUnreadOnly: boolean) {
    setUnreadOnly(nextUnreadOnly);
    setPage(0);
  }

  async function handleMarkAllRead() {
    if (markingAll || totalElements === 0) return;
    setMarkingAll(true);
    try {
      await PostAllNotificationsReaded();
      await loadNotifications();
      onNotificationsChanged?.();
    } catch {
      setError("Não foi possível marcar todas como lidas.");
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleNotificationClick(notification: NotificationModel) {
    if (busyId) return;
    setBusyId(notification.id);
    try {
      if (!notification.read) {
        await PostNotificationsReaded(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, read: true } : item,
          ),
        );
        onNotificationsChanged?.();
      }
      close();
      if (notification.link) navigate(notification.link);
    } catch {
      setError("Não foi possível atualizar esta notificação.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar notificações"
        onClick={close}
        className="absolute inset-0 bg-slate-950/40"
      />

      <aside
        aria-label="Central de notificações"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Central
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Notificações
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {totalElements}{" "}
              {totalElements === 1 ? "notificação" : "notificações"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Preferências de notificações"
              title="Preferências"
              onClick={() => void openPreferences()}
              className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Icon name="settings" size={19} />
            </button>
            <button
              type="button"
              aria-label="Fechar"
              onClick={close}
              className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {preferencesOpen ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setPreferencesOpen(false)}
                className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <Icon name="arrow-left" size={18} />
              </button>
              <div>
                <h3 className="font-semibold text-slate-800">Preferências</h3>
                <p className="text-xs text-slate-500">
                  Escolha quais avisos também serão enviados por e-mail.
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingPreferences ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Carregando preferências...
                </p>
              ) : preferencesError && !preferences.length ? (
                <p className="text-sm text-rose-600">{preferencesError}</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {preferences.map((item) => (
                    <label
                      key={item.type}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-slate-800">
                          {item.label}
                        </span>
                        {item.mandatory && (
                          <span className="mt-1 block text-xs text-slate-400">
                            Notificação obrigatória
                          </span>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={item.emailEnabled}
                        disabled={item.mandatory || savingPreferences}
                        onChange={(event) =>
                          setPreferences((current) =>
                            current.map((preference) =>
                              preference.type === item.type
                                ? {
                                    ...preference,
                                    emailEnabled: event.target.checked,
                                  }
                                : preference,
                            ),
                          )
                        }
                        className="h-4 w-4 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed"
                      />
                    </label>
                  ))}
                </div>
              )}
              {preferencesError && preferences.length > 0 && (
                <p role="alert" className="mt-3 text-sm text-rose-600">
                  {preferencesError}
                </p>
              )}
              {preferencesSuccess && (
                <p className="mt-3 text-sm text-emerald-700">
                  Preferências salvas com sucesso.
                </p>
              )}
            </div>
            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                disabled={
                  loadingPreferences || savingPreferences || !preferences.length
                }
                onClick={() => void savePreferences()}
                className="cursor-pointer w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingPreferences ? "Salvando..." : "Salvar preferências"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-3">
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => changeFilter(false)}
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    !unreadOnly
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => changeFilter(true)}
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    unreadOnly
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Não lidas
                </button>
              </div>

              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={
                  markingAll ||
                  totalElements === 0 ||
                  (unreadOnly && notifications.every((item) => item.read))
                }
                className="cursor-pointer text-xs font-semibold text-indigo-600 transition hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                {markingAll ? "Atualizando..." : "Marcar todas como lidas"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                  Carregando notificações...
                </div>
              ) : error ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-rose-600">{error}</p>
                  <button
                    type="button"
                    onClick={() => void loadNotifications()}
                    className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex h-56 flex-col items-center justify-center px-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Icon name="bell" size={22} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    {unreadOnly
                      ? "Nenhuma notificação não lida"
                      : "Nenhuma notificação por aqui"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Quando houver atualizações dos seus projetos, elas
                    aparecerão aqui.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const visual = notificationVisuals[notification.type] ?? {
                    icon: "bell",
                    color: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => void handleNotificationClick(notification)}
                      disabled={busyId === notification.id}
                      className={`cursor-pointer flex w-full gap-4 border-b border-slate-100 px-6 py-5 text-left transition hover:bg-slate-50 disabled:opacity-60 ${
                        !notification.read ? "bg-indigo-50/30" : "bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${visual.color}`}
                      >
                        <Icon name={visual.icon} size={20} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start gap-2">
                          <span
                            className={`flex-1 text-sm ${notification.read ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}
                          >
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span
                              aria-label="Não lida"
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600"
                            />
                          )}
                        </span>

                        <span className="mt-1 block text-sm leading-5 text-slate-500">
                          {notification.message}
                        </span>

                        <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>
                            {formatNotificationDate(notification.createdAt)}
                          </span>
                          {notification.resolved && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                              Resolvida
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {totalPages > 1 && !loading && !error && (
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  disabled={page === 0}
                  className="text-sm font-semibold text-indigo-600 disabled:text-slate-300"
                >
                  Anterior
                </button>
                <span className="text-xs text-slate-500">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages - 1, current + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="text-sm font-semibold text-indigo-600 disabled:text-slate-300"
                >
                  Próxima
                </button>
              </div>
            )}

            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={close}
                className="cursor-pointer w-full rounded-xl px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Fechar notificações
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
