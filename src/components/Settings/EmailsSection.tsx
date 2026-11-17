import { useEffect, useState } from "react";
import type {
  EmailDeliveryModel,
  PagedModel,
} from "../../models/notificationModel";
import type { EmailStatus } from "../../types/notificationType";
import {
  GetEmails,
  PostResendEmail,
} from "../../services/notificationsService";
import { Icon } from "../Icon";

const PAGE_SIZE = 10;

function dateLabel(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR");
}

const statusLabel: Record<EmailStatus, string> = {
  PENDING: "Pendente",
  SENT: "Enviado",
  FAILED: "Falhou",
};

export function EmailsSection() {
  const [data, setData] = useState<PagedModel<EmailDeliveryModel> | null>(null);
  const [status, setStatus] = useState<EmailStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // O estado de loading é ligado nos handlers (filtro, página, atualizar);
  // o effect só sincroniza com a API e atualiza o estado após a resposta.
  useEffect(() => {
    let active = true;

    GetEmails({
      status: status === "ALL" ? undefined : status,
      page,
      size: PAGE_SIZE,
      sort: ["createdAt,desc"],
    })
      .then((response) => {
        if (!active) return;
        setData(response);
        setError("");
      })
      .catch(() => {
        if (active)
          setError("Não foi possível carregar o histórico de e-mails.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status, page, reloadKey]);

  function reload() {
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  function changePage(next: number) {
    setLoading(true);
    setPage(next);
  }

  async function retry(email: EmailDeliveryModel) {
    if (email.status !== "FAILED" || busyId) return;
    if (!window.confirm(`Deseja reenviar o e-mail para ${email.to}?`)) return;
    setBusyId(email.id);
    setError("");
    setFeedback("");
    try {
      const updated = await PostResendEmail(email.id);
      setData((current) =>
        current
          ? {
              ...current,
              content: current.content.map((item) =>
                item.id === updated.id ? updated : item,
              ),
            }
          : current,
      );
      setFeedback("Solicitação de reenvio realizada.");
    } catch {
      setError("Não foi possível reenviar este e-mail.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Histórico de e-mails
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Consulte os e-mails enviados pelo sistema e tente reenviar mensagens
          que falharam.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => {
              setLoading(true);
              setStatus(event.target.value as EmailStatus | "ALL");
              setPage(0);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="SENT">Enviado</option>
            <option value="FAILED">Falhou</option>
          </select>
        </label>
        <button
          type="button"
          onClick={reload}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Icon name="refresh-cw" size={15} /> Atualizar
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      {feedback && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {feedback}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Destinatário</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tentativas</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3">Enviado em</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Carregando e-mails...
                </td>
              </tr>
            ) : data?.content.length ? (
              data.content.map((email) => (
                <tr key={email.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 text-slate-700">{email.to}</td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {email.subject}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{email.event}</p>
                    {email.lastError && (
                      <p className="mt-1 text-xs text-rose-600">
                        {email.lastError}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${email.status === "SENT" ? "bg-emerald-50 text-emerald-700" : email.status === "FAILED" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {statusLabel[email.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{email.attempts}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {dateLabel(email.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {dateLabel(email.sentAt)}
                  </td>
                  <td className="px-4 py-3">
                    {email.status === "FAILED" ? (
                      <button
                        type="button"
                        disabled={busyId === email.id}
                        onClick={() => void retry(email)}
                        className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                      >
                        {busyId === email.id ? "Reenviando..." : "Reenviar"}
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Nenhum e-mail encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data && data.page.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {data.page.totalElements} e-mails
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => changePage(Math.max(0, page - 1))}
              className="cursor-pointer font-medium text-indigo-600 disabled:text-slate-300"
            >
              Anterior
            </button>
            <span className="text-slate-500">
              Página {page + 1} de {data.page.totalPages}
            </span>
            <button
              type="button"
              disabled={page + 1 >= data.page.totalPages || loading}
              onClick={() => changePage(page + 1)}
              className="cursor-pointer font-medium text-indigo-600 disabled:text-slate-300"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
