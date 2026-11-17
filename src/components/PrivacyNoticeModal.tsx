import { useState } from "react";
import { useUser } from "../contexts/userContext";
import { clearSession } from "../config/apiConfig";
import { Icon } from "./Icon";

export function PrivacyNoticeModal() {
  const { acceptPrivacy } = useUser();
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    if (!accepted || saving) return;
    setSaving(true);
    setError("");
    try {
      await acceptPrivacy();
    } catch {
      setError("Não foi possível registrar seu aceite. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-slate-100 p-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <Icon name="shield-check" size={23} />
          </span>
          <h2
            id="privacy-title"
            className="mt-4 text-xl font-bold text-slate-900"
          >
            Aviso de privacidade
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Antes de continuar, leia as informações sobre o tratamento dos seus
            dados no sistema.
          </p>
        </div>
        <div className="max-h-[45vh] space-y-3 overflow-y-auto px-6 py-5 text-sm leading-6 text-slate-600">
          <p>
            Os dados pessoais informados neste sistema são utilizados para
            identificação, autenticação, gestão de projetos de iniciação
            científica, acompanhamento de avaliações e relatórios e comunicação
            de informações relacionadas às atividades acadêmicas.
          </p>
          <p>
            O acesso às informações é limitado conforme o perfil e as permissões
            de cada usuário. Os dados devem ser mantidos atualizados e
            utilizados exclusivamente para as finalidades institucionais do
            sistema.
          </p>
          <p>
            Em caso de dúvidas sobre o uso dos seus dados, procure os
            responsáveis institucionais pelo sistema.
          </p>
        </div>
        <div className="border-t border-slate-100 p-6">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer accent-indigo-600"
            />
            <span>Declaro que li e estou ciente do aviso de privacidade.</span>
          </label>
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                clearSession();
                window.location.replace("/login");
              }}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Sair
            </button>
            <button
              type="button"
              disabled={!accepted || saving}
              onClick={() => void handleAccept()}
              className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Registrando..." : "Aceitar e continuar"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
