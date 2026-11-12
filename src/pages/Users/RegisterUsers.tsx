import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { UserRole } from "../../types/userRoleType";
import { UserProfileOptions } from "../../components/Users/UserProfileOptions";
import type { RegisterUserModel } from "../../models/userModel";
import type { CourseModel } from "../../models/projectModel";
import { registerUser } from "../../services/userService";
import { GetAllCourses } from "../../services/coursesService";
import type { PendingUser } from "../../components/Users/PendingUserCard";
import { maskCpf } from "../../utils/maskCpf";
import { maskPhone } from "../../utils/maskPhone";

export function UserAddPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const pendingUser = (location.state as { pendingUser?: PendingUser } | null)
    ?.pendingUser;

  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [form, setForm] = useState(() => ({
    name: pendingUser?.name ?? "",
    email: pendingUser?.email ?? "",
    cpf: pendingUser?.cpf ? maskCpf(pendingUser.cpf) : "",
    phone: pendingUser?.phone ? maskPhone(pendingUser.phone) : "",
    courseId: pendingUser?.course ?? "",
    degree: pendingUser?.degree ?? "",
    institution: pendingUser?.institution ?? "",
    roles: pendingUser ? (["EVALUATOR"] as UserRole[]) : ([] as UserRole[]),
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

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
          setError("Não foi possível carregar os cursos.");
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

  function update<K extends keyof RegisterUserModel>(
    field: K,
    value: RegisterUserModel[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data: RegisterUserModel = {
        ...form,
        cpf: form.cpf.replace(/\D/g, ""),
        phone: form.phone.replace(/\D/g, ""),
      };

      const response = await registerUser(data);
      setTemporaryPassword(response.temporaryPassword);
    } catch {
      setError("Não foi possível cadastrar o usuário. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  if (temporaryPassword) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl text-green-700">
            ✓
          </div>

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Usuário cadastrado!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            O cadastro foi realizado. Guarde a senha temporária.
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Senha temporária</p>
          <p className="mt-1 break-all font-mono font-semibold text-gray-900">
            {temporaryPassword}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-medium text-white"
        >
          Voltar para usuários
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mb-3 text-sm text-blue-700 hover:underline"
        >
          ← Voltar para usuários
        </button>

        <p className="text-sm font-medium text-blue-700">
          Administração de acesso
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Adicionar usuário
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Cadastre os dados e defina os perfis de acesso.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Dados cadastrais</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">
              Nome completo *
            </span>

            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
              placeholder="Nome completo"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">E-mail *</span>

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
              placeholder="usuario@uea.edu.br"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">CPF *</span>

            <input
              required
              value={form.cpf}
              onChange={(e) => update("cpf", maskCpf(e.target.value))}
              maxLength={14}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
              placeholder="000.000.000-00"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">Telefone</span>

            <input
              value={form.phone}
              onChange={(e) => update("phone", maskPhone(e.target.value))}
              maxLength={15}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
              placeholder="(92) 99999-9999"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium">Curso *</span>

            <select
              required
              value={form.courseId}
              onChange={(e) => update("courseId", e.target.value)}
              disabled={loadingCourses}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm disabled:opacity-50"
            >
              <option value="">
                {loadingCourses ? "Carregando cursos..." : "Selecione o curso"}
              </option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} — {course.unit.acronym}
                </option>
              ))}
            </select>
          </label>

          {showAcademicInfo && (
            <>
              <label>
                <span className="mb-1.5 block text-sm font-medium">
                  Titulação *
                </span>

                <select
                  required
                  value={form.degree}
                  onChange={(e) => update("degree", e.target.value)}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Selecione a titulação</option>
                  <option value="Graduação">Graduação</option>
                  <option value="Especialização">Especialização</option>
                  <option value="Mestrado">Mestrado</option>
                  <option value="Doutorado">Doutorado</option>
                  <option value="Pós-doutorado">Pós-doutorado</option>
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium">
                  Instituição *
                </span>

                <input
                  required
                  value={form.institution}
                  onChange={(e) => update("institution", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  placeholder="Nome da instituição"
                />
              </label>
            </>
          )}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Perfis e permissões</h2>

        <p className="mt-1 text-sm text-gray-500">
          Selecione os perfis que o usuário terá no sistema.
        </p>

        <div className="mt-5">
          <UserProfileOptions
            profiles={form.roles}
            onChange={(roles: UserRole[]) => update("roles", roles)}
          />
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="rounded-lg border px-5 py-2.5 text-sm"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading || loadingCourses || !form.roles.length}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Cadastrar usuário"}
        </button>
      </div>
    </form>
  );
}
