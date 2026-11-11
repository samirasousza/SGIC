import { Icon } from "./Icon";
import { useUser } from "../contexts/userContext";
import { formatCpf } from "../utils/formatCpf";
import { formatPhone } from "../utils/formatPhone";
import { translateRole } from "../utils/translateRole";

interface ProfileModalProps {
  close: () => void;
}

export function ProfileModal({ close }: ProfileModalProps) {
  const { user, loading, error, refreshUser } = useUser();

  const isStudent = user?.roles.includes("STUDENT");

  const data = [
    { label: "Nome completo", value: user?.name || "—" },
    { label: "E-mail institucional", value: user?.email || "—" },
    { label: "CPF", value: formatCpf(user?.cpf) },
    { label: "Telefone", value: formatPhone(user?.phone) },
    ...(isStudent
      ? [
          {
            label: "Matrícula",
            value: user?.registration || "—",
          },
          { label: "Curso", value: user?.course?.name || "—" },
          {
            label: "Unidade",
            value: user?.course?.unit
              ? `${user.course.unit.acronym} - ${user.course.unit.name}`
              : "—",
          },
        ]
      : []),
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
          {loading && !user ? (
            <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[74px] animate-pulse rounded-xl border border-slate-100 bg-slate-100"
                />
              ))}
            </div>
          ) : error && !user ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => refreshUser()}
                className="mt-2 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
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
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Funções vinculadas
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    role
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {translateRole(role)}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Perfil principal no acesso:{" "}
              {user?.roles[0] ? translateRole(user.roles[0]) : "Não definido"}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={close}
            className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </section>
    </div>
  );
}
