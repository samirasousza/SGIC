import { useState } from "react";
import type { UserModel } from "../../models/userModel";
import type { UserRole } from "../../types/userRoleType";
import { USER_ROLE_LABELS } from "../../types/userRoleType";
import { UserProfileOptions } from "./UserProfileOptions";
import { updateUserRoles } from "../../services/userService";
import { Button } from "../Button";

interface UserProfileManagementProps {
  user: UserModel;
  onClose: () => void;
  onSaved: (user: UserModel) => void;
}

const ADMIN_MANAGED_ROLES: UserRole[] = [
  "ADMIN",
  "LOCAL_COMMITTEE",
  "TECHNICAL_SUPPORT",
  "EVALUATOR",
];
const SISPROJ_MANAGED_ROLES: UserRole[] = ["STUDENT", "ADVISOR"];

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
      const updated = await updateUserRoles(user.id, {
        roles: profiles.filter((role) => ADMIN_MANAGED_ROLES.includes(role)),
      });
      onSaved(updated);
      onClose();
    } catch {
      setError("Não foi possível atualizar os perfis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profiles-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#143c54]">
              Administração de acesso
            </p>
            <h2
              id="user-profiles-title"
              className="mt-1 text-xl font-semibold text-slate-900"
            >
              Gerenciar perfis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {user.name} · {user.email}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </header>
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Aluno e Orientador são gerenciados pelo SISPROJ. Aluno, Apoio
            técnico e Administrador são perfis exclusivos. Comitê local exige
            Orientador.
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Perfis atuais
            </p>
            <div className="flex flex-wrap gap-2">
              {profiles.length ? (
                profiles.map((profile) => (
                  <span
                    key={profile}
                    className="rounded-full bg-[#eaf1f5] px-3 py-1 text-xs font-medium text-[#143c54]"
                  >
                    {USER_ROLE_LABELS[profile]}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  Nenhum perfil selecionado
                </span>
              )}
            </div>
          </div>
          <UserProfileOptions
            profiles={profiles}
            onChange={setProfiles}
            lockedProfiles={SISPROJ_MANAGED_ROLES}
          />
          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              loading ||
              !profiles.some((role) => ADMIN_MANAGED_ROLES.includes(role))
            }
          >
            {loading ? "Salvando..." : "Salvar perfis"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
