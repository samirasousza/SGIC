import { translateRole } from "../../utils/translateRole";
import { formatCpf } from "../../utils/formatCpf";
import { formatPhone } from "../../utils/formatPhone";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { formatRequestDate } from "../../utils/formatRequestDate";
import type { UserRole } from "../../types/userRoleType";

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  degree: string;
  institution: string;
  course: string; // nome do curso
  requestedBy: string;
  requesterRole: UserRole;
  project: string;
  reason: string;
  date: string;
}

interface PendingUserCardProps {
  request: PendingUser;
  onRegister: (request: PendingUser) => void;
  onReject: (id: string) => void;
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "Não informado"}
      </p>
    </div>
  );
}

export function PendingUserCard({
  request,
  onRegister,
  onReject,
}: PendingUserCardProps) {
  const cpf = formatCpf(request.cpf);
  const phone = formatPhone(request.phone);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eaf1f5] text-sm font-semibold text-[#143c54]">
            {<Icon name="user" size={19} />}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">{request.name}</h3>
            <p className="break-all text-sm text-slate-500">{request.email}</p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Aguardando análise
        </span>
      </div>

      {/* Dados do avaliador */}
      <section className="mt-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">
          Dados do avaliador
        </h4>

        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Nome completo" value={request.name} />
          <InfoItem label="E-mail" value={request.email} />
          <InfoItem label="CPF" value={cpf} />
          <InfoItem label="Telefone" value={phone} />
          <InfoItem label="Titulação" value={request.degree} />
          <InfoItem label="Instituição" value={request.institution} />
          <InfoItem label="Curso" value={request.course} />
        </div>
      </section>

      {/* Dados da solicitação */}
      <section className="mt-6 border-t border-slate-100 pt-5">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">
          Dados da solicitação
        </h4>

        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Solicitado por" value={request.requestedBy} />
          <InfoItem
            label="Papel do solicitante"
            value={translateRole(request.requesterRole)}
          />
          <InfoItem
            label="Data da solicitação"
            value={formatRequestDate(request.date)}
          />
          <InfoItem
            label="Projeto vinculado"
            value={request.project}
            className="sm:col-span-2 lg:col-span-3"
          />
          <InfoItem
            label="Motivo da solicitação"
            value={request.reason}
            className="sm:col-span-2 lg:col-span-3"
          />
        </div>
      </section>

      {/* Ações */}
      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        <Button variant="danger" onClick={() => onReject(request.id)}>
          Recusar solicitação
        </Button>
        <Button onClick={() => onRegister(request)}>Cadastrar usuário</Button>
      </div>
    </article>
  );
}
