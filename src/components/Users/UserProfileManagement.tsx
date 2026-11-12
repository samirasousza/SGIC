import { useState } from "react";
import type { UserModel } from "../../models/userModel";
import type { UserRole } from "../../types/userRoleType";
import { UserProfileOptions } from "./UserProfileOptions";
import { updateUserRoles } from "../../services/userService";

interface UserProfileManagementProps {
  user: UserModel;
  onClose: () => void;
  onSaved: (user: UserModel) => void;
}

export function UserProfileManagement({
  user,
  onClose,
  onSaved,
}: UserProfileManagementProps) {
  const [profiles, setProfiles] = useState<UserRole[]>(user.roles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    try {
      setLoading(true);
      setError("");

      const updated = await updateUserRoles(user.id, { roles: profiles });
      onSaved(updated);
      onClose();
    } catch {
      setError("Não foi possível atualizar os perfis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <header className="flex items-start justify-between border-b p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Administração de acesso
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Gerenciar perfis
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {user.name} · {user.email}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            Aluno, Apoio técnico e Administrador são exclusivos. Comitê local
            exige Orientador.
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              Configuração resultante
            </p>
            <div className="flex flex-wrap gap-2">
              {profiles.length ? (
                profiles.map((profile) => (
                  <span
                    key={profile}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800"
                  >
                    {profile}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  Nenhum perfil selecionado
                </span>
              )}
            </div>
          </div>

          <UserProfileOptions profiles={profiles} onChange={setProfiles} />

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <footer className="flex justify-end gap-3 border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancelar
          </button>

          <button
            disabled={!profiles.length || loading}
            onClick={handleSave}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar perfis"}
          </button>
        </footer>
      </section>
    </div>
  );
}
