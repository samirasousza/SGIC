
import { Icon } from "./Icon";
import {
  profileName,
  type Role,
} from "../pages/Login/LoginTypes";

interface ProfileModalProps {
  role: Role;
  close: () => void;
}

function profilesForRole(role: Role): Role[] {
  if (role === "Orientador e avaliador") {
    return ["Orientador", "Avaliador"];
  }

  if (role === "Comitê local") {
    return ["Orientador", "Avaliador", "Comitê local"];
  }

  return [role];
}

export function ProfileModal({ role, close }: ProfileModalProps) {
  const isStudent = role === "Aluno";
  const profiles = profilesForRole(role);
  const name = profileName(role)
    .replace("Prof. ", "")
    .replace("Profa. ", "");

  const data = [
    { label: "Nome completo", value: name },
    {
      label: "E-mail institucional",
      value: isStudent
        ? "samira@aluno.uea.edu.br"
        : "usuario@uea.edu.br",
    },
    {
      label: isStudent ? "Matrícula" : "Número institucional",
      value: isStudent ? "22150184" : "009842",
    },
    { label: "CPF", value: "123.482.769-09" },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar perfil"
        onClick={close}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Conta institucional
            </span>
            <h2
              id="profile-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              Meu perfil
            </h2>
          </div>

          <button
            type="button"
            aria-label="Fechar"
            onClick={close}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-medium text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Funções vinculadas
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <span
                  key={profile}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    profile === role
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {profile}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Perfil principal no acesso: {role}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </section>
    </div>
  );
}
