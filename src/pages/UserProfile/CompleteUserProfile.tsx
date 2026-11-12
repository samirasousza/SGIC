import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { registerStudentInfo } from "../../services/loggedUserService";
import type { UserInfosUpdateModel } from "../../models/userModel";
import type { CourseModel } from "../../models/projectModel";
import { GetAllCourses } from "../../services/coursesService";
import { maskCpf } from "../../utils/maskCpf";
import { maskPhone } from "../../utils/maskPhone";
import { getApiError } from "../../utils/apiErrorResponse";

interface CompleteStudentProfileProps {
  onCompleted: () => Promise<void>;
  onCancel: () => void;
}

export function CompleteStudentProfile({
  onCompleted,
  onCancel,
}: CompleteStudentProfileProps) {
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [cpf, setCpf] = useState("");
  const [courseId, setCourseId] = useState("");
  const [phone, setPhone] = useState("");
  const [pcd, setPcd] = useState<boolean | null>(null);
  const [hasDegree, setHasDegree] = useState<boolean | null>(null);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await GetAllCourses();
        setCourses(response);
      } catch {
        setError("Não foi possível carregar os cursos.");
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, []);

  function clearFieldError(field: string) {
    setFieldErrors((previous) => {
      const updated = { ...previous };
      delete updated[field];
      return updated;
    });

    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const cpfDigits = cpf.replace(/\D/g, "");
    const phoneDigits = phone.replace(/\D/g, "");

    if (!courseId || pcd === null || hasDegree === null) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (cpfDigits.length !== 11) {
      setFieldErrors({ cpf: "Informe um CPF válido com 11 dígitos." });
      return;
    }

    if (phoneDigits.length !== 10 && phoneDigits.length !== 11) {
      setFieldErrors({ phone: "Informe um telefone válido com DDD." });
      return;
    }

    const registerData: UserInfosUpdateModel = {
      cpf: cpfDigits,
      courseId,
      phone: phoneDigits,
      pcd,
      hasDegree,
    };

    try {
      setSaving(true);

      await registerStudentInfo(registerData);
      await onCompleted();
    } catch (err) {
      const apiError = getApiError(err);

      setError(apiError.message);
      setFieldErrors(apiError.fieldErrors);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  const radioClass =
    "flex cursor-pointer items-center gap-2 text-sm text-slate-700";

  const getInputClass = (field: string) =>
    `${inputClass} ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : ""
    }`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">
            Complete seu cadastro
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Para continuar utilizando o SGIC, precisamos que você informe alguns
            dados que ainda não constam no sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Curso */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Curso <span className="text-red-500">*</span>
            </label>

            <select
              value={courseId}
              onChange={(event) => {
                setCourseId(event.target.value);
                clearFieldError("courseId");
              }}
              className={`${getInputClass("courseId")} cursor-pointer`}
              disabled={loadingCourses}
              required
            >
              <option value="">
                {loadingCourses
                  ? "Carregando cursos..."
                  : "Selecione seu curso"}
              </option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} — {course.unit.acronym}
                </option>
              ))}
            </select>

            {fieldErrors.courseId && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {fieldErrors.courseId}
              </p>
            )}

            {!loadingCourses && courses.length === 0 && (
              <p className="mt-1 text-xs text-red-500">
                Nenhum curso disponível.
              </p>
            )}
          </div>

          {/* CPF */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              CPF <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={cpf}
              onChange={(event) => {
                setCpf(maskCpf(event.target.value));
                clearFieldError("cpf");
              }}
              className={getInputClass("cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />

            {fieldErrors.cpf && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {fieldErrors.cpf}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Número de telefone <span className="text-red-500">*</span>
            </label>

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(maskPhone(event.target.value));
                clearFieldError("phone");
              }}
              className={getInputClass("phone")}
              placeholder="(00) 00000-0000"
              maxLength={15}
              required
            />

            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* PcD */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">
              Você é uma pessoa com deficiência (PcD)?
              <span className="text-red-500"> *</span>
            </legend>

            <div className="flex gap-6">
              <label className={radioClass}>
                <input
                  type="radio"
                  name="pcd"
                  value="true"
                  checked={pcd === true}
                  onChange={() => {
                    setPcd(true);
                    clearFieldError("pcd");
                  }}
                  required
                  className="h-4 w-4 accent-indigo-600"
                />
                Sim
              </label>

              <label className={radioClass}>
                <input
                  type="radio"
                  name="pcd"
                  value="false"
                  checked={pcd === false}
                  onChange={() => {
                    setPcd(false);
                    clearFieldError("pcd");
                  }}
                  className="h-4 w-4 accent-indigo-600"
                />
                Não
              </label>
            </div>

            {fieldErrors.pcd && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {fieldErrors.pcd}
              </p>
            )}
          </fieldset>

          {/* Diploma */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">
              Possui diploma de graduação?
              <span className="text-red-500"> *</span>
            </legend>

            <div className="flex gap-6">
              <label className={radioClass}>
                <input
                  type="radio"
                  name="hasDegree"
                  value="true"
                  checked={hasDegree === true}
                  onChange={() => {
                    setHasDegree(true);
                    clearFieldError("hasDegree");
                  }}
                  required
                  className="h-4 w-4 accent-indigo-600"
                />
                Sim
              </label>

              <label className={radioClass}>
                <input
                  type="radio"
                  name="hasDegree"
                  value="false"
                  checked={hasDegree === false}
                  onChange={() => {
                    setHasDegree(false);
                    clearFieldError("hasDegree");
                  }}
                  className="h-4 w-4 accent-indigo-600"
                />
                Não
              </label>
            </div>

            {fieldErrors.hasDegree && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {fieldErrors.hasDegree}
              </p>
            )}
          </fieldset>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving || loadingCourses || courses.length === 0}
              className="h-11 w-full cursor-pointer rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar informações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
