import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "../Button";
import { Icon } from "../Icon";

import type { CourseModel } from "../../models/projectModel";
import { GetAllCourses } from "../../services/coursesService";
import { maskCpf } from "../../utils/maskCpf";
import { maskPhone } from "../../utils/maskPhone";

export interface ExternalEvaluatorData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  degree: string;
  institution: string;
  courseId: string;
}

interface ExternalEvaluatorModalProps {
  close: () => void;
  submit: (data: ExternalEvaluatorData) => void;
}

export function ExternalEvaluatorModal({
  close,
  submit,
}: ExternalEvaluatorModalProps) {
  const [courses, setCourses] = useState<CourseModel[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("Doutorado");
  const [institution, setInstitution] = useState("");
  const [courseId, setCourseId] = useState("");

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");

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

    void loadCourses();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cpfDigits = cpf.replace(/\D/g, "");
    const phoneDigits = phone.replace(/\D/g, "");

    if (cpfDigits.length !== 11) {
      setError("Informe um CPF válido com 11 dígitos.");
      return;
    }

    if (phoneDigits.length !== 10 && phoneDigits.length !== 11) {
      setError("Informe um telefone válido com DDD.");
      return;
    }

    if (!courseId) {
      setError("Selecione o curso.");
      return;
    }

    submit({
      name: name.trim(),
      email: email.trim(),
      cpf: cpfDigits,
      phone: phoneDigits,
      degree,
      institution: institution.trim(),
      courseId,
    });
  }

  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={close}
        aria-label="Fechar solicitação"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-evaluator-title"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#143c54]">
              Novo avaliador externo
            </span>

            <h2
              id="external-evaluator-title"
              className="mt-1 text-lg font-semibold text-slate-800"
            >
              Solicitar cadastro ao administrador
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informe os dados do avaliador para solicitar a criação do acesso.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
            {/* Nome */}
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Nome completo *
              </span>

              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome do avaliador"
                className={inputClass}
              />
            </label>

            {/* E-mail */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                E-mail *
              </span>

              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@instituicao.br"
                className={inputClass}
              />
            </label>

            {/* CPF */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">CPF *</span>

              <input
                required
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={cpf}
                onChange={(event) => setCpf(maskCpf(event.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className={inputClass}
              />
            </label>

            {/* Telefone */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Número de telefone *
              </span>

              <input
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(maskPhone(event.target.value))}
                placeholder="(92) 99999-9999"
                maxLength={15}
                className={inputClass}
              />
            </label>

            {/* Titulação */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Titulação *
              </span>

              <select
                required
                value={degree}
                onChange={(event) => setDegree(event.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Doutorado">Doutorado</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Especialização">Especialização</option>
              </select>
            </label>

            {/* Instituição */}
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Instituição *
              </span>

              <input
                required
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                placeholder="Instituição de vínculo"
                className={inputClass}
              />
            </label>

            {/* Curso */}
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Curso *
              </span>

              <select
                required
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                disabled={loadingCourses}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">
                  {loadingCourses
                    ? "Carregando cursos..."
                    : "Selecione o curso"}
                </option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} — {course.unit.acronym}
                  </option>
                ))}
              </select>

              {!loadingCourses && courses.length === 0 && (
                <span className="text-xs text-red-500">
                  Nenhum curso disponível.
                </span>
              )}
            </label>
          </div>

          {error && (
            <p className="mx-6 mb-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>

            <Button
              type="submit"
              icon="check"
              disabled={loadingCourses || courses.length === 0}
            >
              Enviar solicitação
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
