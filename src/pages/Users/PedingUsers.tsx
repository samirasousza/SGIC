import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PendingUserCard,
  type PendingUser,
} from "../../components/Users/PendingUserCard";
import type { UserRequestModel } from "../../models/UserRequestsModel";
import { academicTitleLabels } from "../../utils/translateAcademicTitle";
import {
  getAllUserRequests,
  rejectUserRequest,
} from "../../services/userRequestssService";
import { Button } from "../../components/Button";

type View = "PENDING" | "HISTORY";

const statusStyle = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
} as const;

const statusLabel = {
  PENDING: "Pendente",
  APPROVED: "Cadastrado",
  REJECTED: "Recusado",
} as const;

function toPendingUser(r: UserRequestModel): PendingUser {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone ?? "",
    email: r.email,
    cpf: r.cpf,
    degree: r.academicTitle ? academicTitleLabels[r.academicTitle] : "",
    institution: r.institution ?? "",
    requestedBy: r.requestedBy.name,
    requesterRole: r.requestedBy.roles.includes("ADVISOR")
      ? "ADVISOR"
      : r.requestedBy.roles[0],
    project: r.project?.title ?? "",
    date: r.requestedAt,
    course: r.course?.name ?? "",
    reason: r.reason,
  };
}

export function PendingUsersPage({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("PENDING");
  const [requests, setRequests] = useState<UserRequestModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getAllUserRequests(
      view === "PENDING" ? ["PENDING"] : ["APPROVED", "REJECTED"],
    )
      .then((data) => {
        if (cancelled) return;

        setRequests(data);
        setError("");

        if (view === "PENDING") {
          onCountChange?.(data.length);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar as solicitações.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [view, onCountChange, refreshKey]);

  function handleRegister(p: PendingUser) {
    const request = requests.find((r) => r.id === p.id);
    if (request) navigate("/user-add", { state: { request } });
  }

  async function handleReject(id: string) {
    const request = requests.find((r) => r.id === id);

    try {
      setError("");
      setMessage("");

      await rejectUserRequest(id);

      setMessage(`Solicitação de ${request?.name ?? "usuário"} recusada.`);

      setLoading(true);
      setRefreshKey((current) => current + 1);
    } catch {
      setError("Não foi possível recusar a solicitação.");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Cadastros de avaliadores externos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Analise as solicitações ou consulte o histórico.
        </p>
      </header>

      <div className="flex gap-2">
        {(["PENDING", "HISTORY"] as const).map((v) => (
          <Button
            key={v}
            variant={view === v ? "primary" : "secondary"}
            onClick={() => {
              setLoading(true);
              setMessage("");
              setView(v);
            }}
          >
            {v === "PENDING" ? "Pendentes" : "Histórico"}
          </Button>
        ))}
      </div>

      {message && (
        <div className="rounded-lg border border-[#dce5eb] bg-[#f2f6f8] p-4 text-sm text-[#143c54]">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Carregando...
          </p>
        ) : !requests.length ? (
          <p className="py-10 text-center text-sm text-slate-500">
            {view === "PENDING"
              ? "Nenhuma solicitação pendente."
              : "Nenhuma solicitação analisada."}
          </p>
        ) : view === "PENDING" ? (
          <div className="space-y-4">
            {requests.map((r) => (
              <PendingUserCard
                key={r.id}
                request={toPendingUser(r)}
                onRegister={handleRegister}
                onReject={(id) => void handleReject(id)}
              />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    {r.email} · solicitado por {r.requestedBy.name}
                    {r.project ? ` · ${r.project.title}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Motivo: {r.reason}
                  </p>
                  {r.reviewedBy && (
                    <p className="text-xs text-slate-400">
                      Analisado por {r.reviewedBy.name}
                      {r.reviewedAt
                        ? ` em ${new Date(r.reviewedAt).toLocaleDateString("pt-BR")}`
                        : ""}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[r.status]}`}
                >
                  {statusLabel[r.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
