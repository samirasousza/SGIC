import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { updatePassword } from "../../services/authService";

export function ChangePasswordPage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("A confirmação da nova senha não corresponde.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("A nova senha deve ser diferente da senha atual.");
      return;
    }

    try {
      setSaving(true);

      await updatePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(true);
    } catch {
      setError(
        "Não foi possível alterar sua senha. Verifique a senha atual e tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  if (success) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 p-6">
        <div className="mx-auto mt-12 w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
            <span className="text-2xl">✓</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Senha alterada com sucesso!
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Sua nova senha já pode ser utilizada nos próximos acessos ao SGIC.
          </p>

          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="mt-6 h-11 w-full cursor-pointer rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Voltar ao sistema
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 p-6">
      <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Alterar senha</h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Informe sua senha atual e escolha uma nova senha para sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Senha atual
            </label>

            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={inputClass}
              placeholder="Digite sua senha atual"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nova senha
            </label>

            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={inputClass}
              placeholder="Digite sua nova senha"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirmar nova senha
            </label>

            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClass}
              placeholder="Digite novamente sua nova senha"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-11 w-full cursor-pointer rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
