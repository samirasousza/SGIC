import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { UpdateUserModel, UserModel } from "../../models/userModel";
import type { UserRole } from "../../types/userRoleType";
import type { CourseModel } from "../../models/projectModel";

import {
  activateUser,
  deactivateUser,
  getUserById,
  updateUser,
  updateUserRoles,
} from "../../services/userService";
import { GetAllCourses } from "../../services/coursesService";

import { UserProfileOptions } from "../../components/Users/UserProfileOptions";
import { UserStatusBadge } from "../../components/Users/UserStatusBadge";
import { academicTitleLabels } from "../../utils/translateAcademicTitle";
import { getApiError } from "../../utils/apiErrorResponse";
import { maskCpf } from "../../utils/maskCpf";
import { maskPhone } from "../../utils/maskPhone";
import { FeedbackCard, type FeedbackData } from "../../components/FeedbackCard";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { translateRole } from "../../utils/translateRole";
import { getUserFieldVisibility } from "../../utils/userFieldVisibility";

const ADMIN_MANAGED_ROLES: UserRole[] = [
  "ADMIN",
  "LOCAL_COMMITTEE",
  "TECHNICAL_SUPPORT",
  "EVALUATOR",
];

interface FormState {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  registration: string;
  courseId: string;
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "Não informado"}
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#143c54] focus:ring-2 focus:ring-[#143c54]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserModel | null>(null);
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    registration: "",
    courseId: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [savingData, setSavingData] = useState(false);
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

    async function loadData() {
      try {
        setLoading(true);
        setLoadError("");

        if (!id) {
          throw new Error("Identificador do usuário não informado.");
        }

        const userData = await getUserById(id);
        if (cancelled) return;

        setUser(userData);
        setRoles(userData.roles);
        setForm({
          name: userData.name,
          email: userData.email,
          cpf: userData.cpf ? maskCpf(userData.cpf) : "",
          phone: userData.phone ? maskPhone(userData.phone) : "",
          registration: userData.registration ?? "",
          courseId: userData.course?.id ?? "",
        });

        try {
          const coursesData = await GetAllCourses();
          if (!cancelled) setCourses(coursesData);
        } catch {
          if (!cancelled) {
            setFeedback({
              type: "error",
              message: "Não foi possível carregar a lista de cursos.",
            });
          }
        } finally {
          if (!cancelled) setLoadingCourses(false);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            getApiError(error).message ||
              "Não foi possível carregar o usuário.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateForm<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFeedback(null);
  }

  function handleRolesChange(next: UserRole[]) {
    setRoles(next);
    setFeedback(null);
  }

  const { showStudentFields, showTeacherFields, showCourse } =
    getUserFieldVisibility(user?.roles);

  const managedRoles = roles.filter((role) =>
    ADMIN_MANAGED_ROLES.includes(role),
  );

  const importedRoles = (user?.roles ?? []).filter(
    (role) => !ADMIN_MANAGED_ROLES.includes(role),
  );

  const originalManagedRoles = (user?.roles ?? []).filter((role) =>
    ADMIN_MANAGED_ROLES.includes(role),
  );

  const rolesChanged =
    managedRoles.length !== originalManagedRoles.length ||
    managedRoles.some((role) => !originalManagedRoles.includes(role));

  const dataChanged =
    !!user &&
    (form.name.trim() !== user.name ||
      form.email.trim() !== user.email ||
      form.cpf.replace(/\D/g, "") !== (user.cpf ?? "") ||
      form.phone.replace(/\D/g, "") !== (user.phone ?? "") ||
      form.registration.trim() !== (user.registration ?? "") ||
      form.courseId !== (user.course?.id ?? ""));

  async function handleSaveData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    try {
      setSavingData(true);
      setFeedback(null);

      const data: UpdateUserModel = {
        name: form.name.trim(),
        email: form.email.trim(),
        cpf: form.cpf.replace(/\D/g, "") || null,
        phone: form.phone.replace(/\D/g, "") || null,
        registration: form.registration.trim() || null,
        courseId: form.courseId || null,
      };

      const updated = await updateUser(user.id, data);

      setUser(updated);
      setForm({
        name: updated.name,
        email: updated.email,
        cpf: updated.cpf ? maskCpf(updated.cpf) : "",
        phone: updated.phone ? maskPhone(updated.phone) : "",
        registration: updated.registration ?? "",
        courseId: updated.course?.id ?? "",
      });

      setFeedback({
        type: "success",
        message: "Dados cadastrais atualizados com sucesso.",
      });
    } catch (error) {
      const { message } = getApiError(error);
      setFeedback({ type: "error", message });
    } finally {
      setSavingData(false);
    }
  }

  async function handleSaveRoles() {
    if (!user) return;

    try {
      setSavingRoles(true);
      setFeedback(null);

      const updated = await updateUserRoles(user.id, {
        roles: managedRoles,
      });

      setUser(updated);
      setRoles(updated.roles);

      setFeedback({
        type: "success",
        message:
          "Perfis atualizados com sucesso. Você será redirecionado em 3 segundos.",
      });
      setLeaving(true);
    } catch (error) {
      setFeedback({
        type: "error",
        message: getApiError(error).message,
      });
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
      setFeedback({
        type: "error",
        message: getApiError(error).message,
      });
    } finally {
      setTogglingAccess(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
        Carregando usuário...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">
          {loadError || "Usuário não encontrado."}
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => navigate("/users")}
        >
          Voltar para usuários
        </Button>
      </div>
    );
  }

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
              Editar usuário
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Atualize os dados cadastrais e gerencie as permissões de acesso.
            </p>
          </div>
          <UserStatusBadge active={user.active} />
        </div>
      </header>

      {feedback && (
        <FeedbackCard
          {...feedback}
          successTitle="Alteração salva"
          errorTitle="Não foi possível concluir"
        />
      )}

      <form onSubmit={handleSaveData} className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-slate-900">Dados cadastrais</h2>
            <p className="mt-1 text-sm text-slate-500">
              Informações pessoais e vínculo institucional do usuário.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Nome completo *
              </span>
              <input
                required
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className={inputClass}
                placeholder="Nome completo"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mail *
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                className={inputClass}
                placeholder="usuario@uea.edu.br"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                CPF
              </span>
              <input
                value={form.cpf}
                onChange={(event) =>
                  updateForm("cpf", maskCpf(event.target.value))
                }
                maxLength={14}
                className={inputClass}
                placeholder="000.000.000-00"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Telefone
              </span>
              <input
                value={form.phone}
                onChange={(event) =>
                  updateForm("phone", maskPhone(event.target.value))
                }
                maxLength={15}
                className={inputClass}
                placeholder="(92) 99999-9999"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Matrícula / registro
              </span>
              <input
                value={form.registration}
                onChange={(event) =>
                  updateForm("registration", event.target.value)
                }
                className={inputClass}
                placeholder="Matrícula ou registro"
              />
            </label>

            {showCourse && (
              <label>
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Curso
                </span>
                <select
                  value={form.courseId}
                  onChange={(event) =>
                    updateForm("courseId", event.target.value)
                  }
                  disabled={loadingCourses}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Nenhum curso vinculado</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {(showTeacherFields || showStudentFields) && (
            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
              {showTeacherFields && (
                <>
                  <InfoItem
                    label="Titulação"
                    value={
                      user.academicTitle
                        ? academicTitleLabels[user.academicTitle]
                        : null
                    }
                  />
                  <InfoItem label="Instituição" value={user.institution} />
                </>
              )}
              {showStudentFields && (
                <>
                  <InfoItem
                    label="Pessoa com deficiência"
                    value={user.pcd == null ? null : user.pcd ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="Possui graduação"
                    value={
                      user.hasDegree == null
                        ? null
                        : user.hasDegree
                          ? "Sim"
                          : "Não"
                    }
                  />
                </>
              )}
            </div>
          )}

          <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
            <Button
              type="submit"
              disabled={savingData || leaving || !dataChanged}
            >
              {savingData ? "Salvando..." : "Salvar dados cadastrais"}
            </Button>
          </div>
        </section>
      </form>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-semibold text-slate-900">Perfis e permissões</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecione os perfis que determinam as permissões do usuário.
          </p>
        </div>

        {importedRoles.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-600">
              Perfis vindos do SISPROJ
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Esses perfis não podem ser alterados por esta tela.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {importedRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {translateRole(role)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <UserProfileOptions
            profiles={roles}
            onChange={handleRolesChange}
            lockedProfiles={importedRoles}
          />
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <Button
            onClick={handleSaveRoles}
            disabled={
              savingRoles || leaving || !managedRoles.length || !rolesChanged
            }
          >
            {savingRoles ? "Salvando..." : "Salvar perfis"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-900">Acesso ao sistema</h2>
        <p className="mt-1 text-sm text-slate-500">
          {user.active
            ? "Este usuário está habilitado para acessar o sistema."
            : "Este usuário está com o acesso desativado."}
        </p>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <Button
            variant={user.active ? "danger" : "primary"}
            onClick={handleToggleAccess}
            disabled={togglingAccess || leaving}
          >
            {togglingAccess
              ? "Aguarde..."
              : user.active
                ? "Desativar acesso"
                : "Reativar acesso"}
          </Button>
        </div>
      </section>
    </div>
  );
}
