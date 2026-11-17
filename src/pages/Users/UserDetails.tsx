import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserModel, RegisterUserResponse } from "../../models/userModel";
import { getUserById, resetUserPassword } from "../../services/userService";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { UserStatusBadge } from "../../components/Users/UserStatusBadge";
import { translateRole } from "../../utils/translateRole";
import { academicTitleLabels } from "../../utils/translateAcademicTitle";
import { formatCpf } from "../../utils/formatCpf";
import { formatPhone } from "../../utils/formatPhone";
import { Icon } from "../../components/Icon";
import { getUserFieldVisibility } from "../../utils/userFieldVisibility";

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "Não informado"}
      </p>
    </div>
  );
}

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetResponse, setResetResponse] =
    useState<RegisterUserResponse | null>(null);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    if (!id) return;
    let active = true;
    getUserById(id)
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os dados do usuário.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleResetPassword() {
    if (!id) return;
    setResetting(true);
    setResetError("");
    try {
      const result = await resetUserPassword(id);
      setResetResponse(result);
      setUser(result.user);
      setConfirmReset(false);
    } catch {
      setResetError("Não foi possível redefinir a senha deste usuário.");
    } finally {
      setResetting(false);
    }
  }

  const { showStudentFields, showTeacherFields, showCourse } =
    getUserFieldVisibility(user?.roles);

  if (loading)
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Carregando dados do usuário...
      </div>
    );
  if (!user)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-rose-600">
          {error || "Usuário não encontrado."}
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => navigate("/users")}
        >
          Voltar
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <header>
        <Breadcrumbs
          items={[
            { label: "Início", onClick: () => navigate("/") },
            { label: "Usuários", onClick: () => navigate("/users") },
            { label: user.name },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dados do usuário
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulte os dados cadastrais, vínculos e permissões desta conta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <UserStatusBadge active={user.active} />
            <Button
              onClick={() => navigate(`/user-edit/${user.id}`)}
              icon="edit"
            >
              Editar usuário
            </Button>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-semibold text-slate-900">
          Informações pessoais
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Nome completo" value={user.name} />
          <Detail label="E-mail" value={user.email} />
          <Detail label="CPF" value={formatCpf(user.cpf)} />
          <Detail label="Telefone" value={formatPhone(user.phone)} />
          <Detail label="Matrícula / registro" value={user.registration} />
          {showCourse && (
            <>
              <Detail label="Curso" value={user.course?.name} />
              <Detail
                label="Unidade"
                value={
                  user.course?.unit
                    ? `${user.course.unit.acronym} - ${user.course.unit.name}`
                    : null
                }
              />
            </>
          )}
          {showTeacherFields && (
            <>
              <Detail
                label="Titulação"
                value={
                  user.academicTitle
                    ? academicTitleLabels[user.academicTitle]
                    : null
                }
              />
              <Detail label="Instituição" value={user.institution} />
            </>
          )}
          {showStudentFields && (
            <>
              <Detail
                label="Pessoa com deficiência"
                value={user.pcd == null ? null : user.pcd ? "Sim" : "Não"}
              />
              <Detail
                label="Possui graduação"
                value={
                  user.hasDegree == null ? null : user.hasDegree ? "Sim" : "Não"
                }
              />
            </>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-900">Perfis e permissões</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <span
              key={role}
              className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
            >
              {translateRole(role)}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Redefinir senha</h2>
            <p className="mt-1 text-sm text-slate-500">
              Gere uma nova senha temporária para este usuário.
            </p>
          </div>
          <Button
            icon="key-round"
            onClick={() => {
              setResetError("");
              setConfirmReset(true);
            }}
          >
            Resetar senha
          </Button>
        </div>
        {resetError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
          >
            {resetError}
          </p>
        )}
        {resetResponse && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              Senha temporária gerada
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              Compartilhe esta senha com o usuário por um canal seguro. Ela não
              será exibida novamente após sair desta tela.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-sm text-slate-900">
                {resetResponse.temporaryPassword}
              </code>
              <button
                type="button"
                onClick={() =>
                  void navigator.clipboard?.writeText(
                    resetResponse.temporaryPassword,
                  )
                }
                className="cursor-pointer rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                <Icon name="copy" size={15} /> Copiar senha
              </button>
            </div>
          </div>
        )}
      </section>

      {confirmReset && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Icon name="key-round" size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Redefinir senha?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Uma nova senha temporária será gerada para{" "}
              <strong>{user.name}</strong>. A senha atual deixará de funcionar.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmReset(false)}
                disabled={resetting}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => void handleResetPassword()}
                disabled={resetting}
              >
                {resetting ? "Gerando..." : "Confirmar redefinição"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
