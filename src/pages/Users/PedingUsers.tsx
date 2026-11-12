import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PendingUserCard,
  type PendingUser,
} from "../../components/Users/PendingUserCard";

const initialRequests: PendingUser[] = [
  {
    id: "1",
    name: "Davi Oliveira",
    phone: "92999999999",
    course: "2f0e9ef3-c620-49d2-8ce0-84c321108c57",
    email: "davi.oliveira@ufam.edu.br",
    cpf: "48271963008",
    degree: "Doutorado",
    institution: "Universidade Federal do Amazonas",
    requestedBy: "Profa. Marcela Souza",
    requesterRole: "LOCAL_COMMITTEE",
    project: "Biodiversidade de insetos aquáticos na Amazônia",
    date: "2026-11-05 23:59:58.083000 +00:00",
  },
  {
    id: "2",
    name: "Helena Barros",
    phone: "92999999999",
    course: "2f0e9ef3-c620-49d2-8ce0-84c321108c57",
    email: "helena.barros@fiocruz.br",
    cpf: "71920486031",
    degree: "Doutorado",
    institution: "Fiocruz Amazônia",
    requestedBy: "Prof. Ricardo Costa",
    requesterRole: "ADVISOR",
    project: "Macroinvertebrados como indicadores da qualidade da água",
    date: "2026-11-12 00:44:15.192000 +00:00",
  },
];

export function PendingUsersPage() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState(initialRequests);
  const [message, setMessage] = useState("");

  function handleRegister(request: PendingUser) {
    // Os dados são encaminhados para o formulário.
    // A persistência da solicitação depende de endpoint próprio.
    navigate("/user-add", {
      state: {
        pendingUser: request,
      },
    });
  }

  function handleReject(id: string) {
    const request = requests.find((item) => item.id === id);

    if (!request) return;

    setRequests((current) => current.filter((item) => item.id !== id));
    setMessage(`Solicitação de ${request.name} removida da demonstração.`);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-700">Administração</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Cadastros pendentes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Analise as solicitações de cadastro de avaliadores externos.
        </p>
      </header>

      {message && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          {message}
        </div>
      )}

      <section className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">
              Solicitações de avaliadores externos
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Confira os dados antes de criar o acesso.
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {requests.length} pendentes
          </span>
        </div>

        {requests.length ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <PendingUserCard
                key={request.id}
                request={request}
                onRegister={handleRegister}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="text-3xl text-green-600">✓</div>
            <h3 className="mt-3 font-semibold text-gray-800">
              Nenhuma solicitação pendente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Novos pedidos aparecerão nesta área quando houver integração.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
