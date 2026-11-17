import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { UserRole } from "../../types/userRoleType";
import { UserProfileOptions } from "../../components/Users/UserProfileOptions";
import type { RegisterUserModel } from "../../models/userModel";
import type { CourseModel } from "../../models/projectModel";
import { registerUser } from "../../services/userService";
import { GetAllCourses } from "../../services/coursesService";
import { maskCpf } from "../../utils/maskCpf";
import { maskPhone } from "../../utils/maskPhone";
import type { AcademicTitleType } from "../../types/academicTitleType";
import type { UserRequestModel } from "../../models/UserRequestsModel";
import { academicTitleOptions } from "../../utils/translateAcademicTitle";
import { getApiError } from "../../utils/apiErrorResponse";
import { FeedbackCard, type FeedbackData } from "../../components/FeedbackCard";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";

interface FormState {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  courseId: string;
  academicTitle: AcademicTitleType | "";
  institution: string;
  roles: UserRole[];
}

export function UserAddPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const request = (location.state as { request?: UserRequestModel } | null)
    ?.request;

  const [form, setForm] = useState<FormState>(() => ({
    name: request?.name ?? "",
    email: request?.email ?? "",
    cpf: request?.cpf ? maskCpf(request.cpf) : "",
    phone: request?.phone ? maskPhone(request.phone) : "",
    courseId: request?.course?.id ?? "",
    academicTitle: request?.academicTitle ?? "",
    institution: request?.institution ?? "",
    roles: request ? (["EVALUATOR"] as UserRole[]) : [],
  }));

  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));

    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }

  const showAcademicInfo = form.roles.some(
    (role) => !["STUDENT", "ADMIN", "TECHNICAL_SUPPORT"].includes(role),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      try {
        const response = await GetAllCourses();

        if (!cancelled) {
          setCourses(response);
        }
      } catch {
        if (!cancelled) {
          setFeedback({
            type: "error",
            message: "Não foi possível carregar os cursos.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingCourses(false);
        }
      }
    }

    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!registered) return;

    const timer = setTimeout(() => navigate("/users"), 3000);

    return () => clearTimeout(timer);
  }, [registered, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setFeedback(null);
      setFieldErrors({});

      const data: RegisterUserModel = {
        name: form.name.trim(),
        email: form.email.trim(),
        cpf: form.cpf.replace(/\D/g, ""),
        phone: form.phone.replace(/\D/g, ""),
        courseId: form.courseId || null,
        academicTitle: form.academicTitle || null,
        institution: form.institution.trim() || null,
        roles: form.roles,
        requestId: request?.id ?? null,
      };

      await registerUser(data);

      setFeedback({
        type: "success",
        message:
          "Usuário cadastrado com sucesso. Você será redirecionado em 3 segundos.",
      });

      setRegistered(true);
    } catch (error) {
      const { message, fieldErrors } = getApiError(error);

      setFieldErrors(fieldErrors);

      setFeedback({
        type: "error",
        message: Object.keys(fieldErrors).length
          ? "Corrija os campos destacados."
          : message,
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-[#143c54]/10 ${
      fieldErrors[field]
        ? "border-rose-500 focus:border-rose-500"
        : "border-slate-200 focus:border-[#143c54]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header>
        <Breadcrumbs
          items={[
            { label: "Início", onClick: () => navigate("/") },
            { label: "Usuários", onClick: () => navigate("/users") },
            { label: "Adicionar usuário" },
          ]}
        />

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Adicionar usuário
        </h1>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-900">Dados cadastrais</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">
              Nome completo *
            </span>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass("name")}
              placeholder="Nome completo"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.name}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">E-mail *</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass("email")}
              placeholder="usuario@uea.edu.br"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">CPF *</span>
            <input
              required
              value={form.cpf}
              onChange={(e) => update("cpf", maskCpf(e.target.value))}
              maxLength={14}
              className={inputClass("cpf")}
              placeholder="000.000.000-00"
            />
            {fieldErrors.cpf && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.cpf}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">Telefone</span>
            <input
              value={form.phone}
              onChange={(e) => update("phone", maskPhone(e.target.value))}
              maxLength={15}
              className={inputClass("phone")}
              placeholder="(92) 99999-9999"
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.phone}</p>
            )}
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Curso *
            </span>
            <select
              value={form.courseId}
              onChange={(e) => update("courseId", e.target.value)}
              disabled={loadingCourses}
              className={
                inputClass("courseId") + " bg-white disabled:opacity-50"
              }
            >
              <option value="">
                {loadingCourses ? "Carregando cursos..." : "Selecione o curso"}
              </option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            {fieldErrors.courseId && (
              <p className="mt-1 text-xs text-rose-600">
                {fieldErrors.courseId}
              </p>
            )}
          </label>

          {showAcademicInfo && (
            <>
              <label>
                <span className="mb-1.5 block text-sm font-medium">
                  Titulação *
                </span>
                <select
                  required
                  value={form.academicTitle}
                  onChange={(e) =>
                    update("academicTitle", e.target.value as AcademicTitleType)
                  }
                  className={inputClass("academicTitle") + " bg-white"}
                >
                  <option value="">Selecione a titulação</option>
                  {academicTitleOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {fieldErrors.academicTitle && (
                  <p className="mt-1 text-xs text-rose-600">
                    {fieldErrors.academicTitle}
                  </p>
                )}
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium">
                  Instituição *
                </span>
                <input
                  required
                  value={form.institution}
                  onChange={(e) => update("institution", e.target.value)}
                  className={inputClass("institution")}
                  placeholder="Nome da instituição"
                />
                {fieldErrors.institution && (
                  <p className="mt-1 text-xs text-rose-600">
                    {fieldErrors.institution}
                  </p>
                )}
              </label>
            </>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-slate-900">Perfis e permissões</h2>

        <p className="mt-1 text-sm text-slate-500">
          Selecione os perfis que o usuário terá no sistema.
        </p>

        <div className="mt-5">
          <UserProfileOptions
            profiles={form.roles}
            onChange={(roles: UserRole[]) => update("roles", roles)}
          />
        </div>

        {fieldErrors.roles && (
          <p className="mt-2 text-xs text-rose-600">{fieldErrors.roles}</p>
        )}
      </section>

      {feedback && (
        <FeedbackCard
          {...feedback}
          successTitle="Cadastro realizado"
          errorTitle="Não foi possível cadastrar"
        />
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/users")}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            loading || loadingCourses || registered || !form.roles.length
          }
        >
          {loading ? "Cadastrando..." : "Cadastrar usuário"}
        </Button>
      </div>
    </form>
  );
}
