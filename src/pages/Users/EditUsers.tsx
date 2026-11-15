import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { UserModel } from "../../models/userModel";
import type { UserRole } from "../../types/userRoleType";
import { USER_ROLE_LABELS } from "../../types/userRoleType";
import {
  activateUser,
  deactivateUser,
  getUserById,
  updateUserRoles,
} from "../../services/userService";

import { UserProfileOptions } from "../../components/Users/UserProfileOptions";
import { UserStatusBadge } from "../../components/Users/UserStatusBadge";
import { academicTitleLabels } from "../../utils/translateAcademicTitle";
import { getApiError } from "../../utils/apiErrorResponse";
import { formatCpf } from "../../utils/formatCpf";
import { formatPhone } from "../../utils/formatPhone";
import { FeedbackCard, type FeedbackData } from "../../components/FeedbackCard";
import { Breadcrumbs } from "../../components/Breadcrumbs";

// Papéis que o administrador pode atribuir (o back recusa os demais).
// Aluno e Orientador vêm da importação do SISPROJ.
const ADMIN_MANAGED_ROLES: UserRole[] = [
  "ADMIN",
  "LOCAL_COMMITTEE",
  "TECHNICAL_SUPPORT",
  "EVALUATOR",
];

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value || "Não informado"}
      </p>
    </div>
  );
}

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserModel | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRoles, setSavingRoles] = useState(false);
  const [togglingAccess, setTogglingAccess] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!leaving) return;

    const timer = setTimeout(() => navigate("/users"), 3000);

    return () => clearTimeout(timer);
  }, [leaving, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      if (!id) {
        setLoadError("Identificador do usuário não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const data = await getUserById(id);

        if (!cancelled) {
          setUser(data);
          setRoles(data.roles);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(getApiError(error).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleRolesChange(next: UserRole[]) {
    setRoles(next);
    setFeedback(null);
  }

  // Só os papéis que o admin pode enviar.
  const managedRoles = roles.filter((role) =>
    ADMIN_MANAGED_ROLES.includes(role),
  );
  const importedRoles = (user?.roles ?? []).filter(
    (role) => !ADMIN_MANAGED_ROLES.includes(role),
  );

  const rolesChanged =
    !!user &&
    managedRoles.length !==
      user.roles.filter((role) => ADMIN_MANAGED_ROLES.includes(role)).length
      ? true
      : !!user && managedRoles.some((role) => !user.roles.includes(role));

  async function handleSaveRoles() {
    if (!user) return;

    try {
      setSavingRoles(true);
      setFeedback(null);

      const updated = await updateUserRoles(user.id, { roles: managedRoles });

      setUser(updated);
      setRoles(updated.roles);
      setFeedback({
        type: "success",
        message:
          "Perfis atualizados com sucesso. Você será redirecionado em 3 segundos.",
      });
      setLeaving(true);
    } catch (error) {
      setFeedback({ type: "error", message: getApiError(error).message });
    } finally {
      setSavingRoles(false);
    }
  }

  async function handleToggleAccess() {
    if (!user) return;

    const activating = !user.active;

    try {
      setTogglingAccess(true);
      setFeedback(null);

      if (activating) {
        await activateUser(user.id);
      } else {
        await deactivateUser(user.id);
      }

      setUser({ ...user, active: activating });
      setFeedback({
        type: "success",
        message: `${
          activating
            ? "Acesso reativado com sucesso."
            : "Acesso desativado. O histórico do usuário foi mantido."
        } Você será redirecionado em 3 segundos.`,
      });
      setLeaving(true);
    } catch (error) {
      setFeedback({ type: "error", message: getApiError(error).message });
    } finally {
      setTogglingAccess(false);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-gray-500">Carregando...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-700">
          {loadError || "Usuário não encontrado."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="cursor-pointer mt-4 text-sm text-blue-700 hover:underline"
        >
          Voltar para usuários
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>

        <Breadcrumbs
          items={[
            { label: "Início", onClick: () => navigate("/") },
            { label: "Usuários", onClick: () => navigate("/users")},
            { label: user.name},
          ]}
        />

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Editar usuário
        </h1>
      </header>

      <section className="rounded-xl border bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="break-all text-sm text-gray-500">{user.email}</p>
          </div>
          <UserStatusBadge active={user.active} />
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="CPF" value={user.cpf ? formatCpf(user.cpf) : null} />
          <InfoItem
            label="Telefone"
            value={user.phone ? formatPhone(user.phone) : null}
          />
          <InfoItem label="Matrícula / registro" value={user.registration} />
          <InfoItem label="Curso" value={user.course?.name} />
          <InfoItem
            label="Unidade"
            value={
              user.course?.unit
                ? `${user.course.unit.name} (${user.course.unit.acronym})`
                : null
            }
          />
          <InfoItem
            label="Titulação"
            value={
              user.academicTitle
                ? academicTitleLabels[user.academicTitle]
                : null
            }
          />
          <InfoItem label="Instituição" value={user.institution} />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Perfis e permissões</h2>
        <p className="mt-1 text-sm text-gray-500">
          Altere os perfis de acesso do usuário.
        </p>

        {importedRoles.length > 0 && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">
              Perfis vindos do SISPROJ (não editáveis)
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {importedRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700"
                >
                  {USER_ROLE_LABELS[role]}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <UserProfileOptions profiles={roles} onChange={handleRolesChange} />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleSaveRoles}
            disabled={
              savingRoles || leaving || !managedRoles.length || !rolesChanged
            }
            className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {savingRoles ? "Salvando..." : "Salvar perfis"}
          </button>
        </div>
      </section>

      {feedback && (
        <FeedbackCard
          {...feedback}
          successTitle="Alteração salva"
          errorTitle="Não foi possível concluir"
        />
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Acesso ao sistema</h2>
        <p className="mt-1 text-sm text-gray-500">
          {user.active
            ? "Este usuário está habilitado para acessar o sistema."
            : "Este usuário está com o acesso desativado."}
        </p>

        <button
          type="button"
          onClick={handleToggleAccess}
          disabled={togglingAccess || leaving}
          className={`cursor-pointer mt-4 rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50 ${
            user.active
              ? "border border-red-200 text-red-700 hover:bg-red-50"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {togglingAccess
            ? "Aguarde..."
            : user.active
              ? "Desativar acesso"
              : "Reativar acesso"}
        </button>
      </section>
    </div>
  );
}
