import type { UserRole } from "../../types/userRoleType";
import { USER_ROLE_OPTIONS, toggleUserRole } from "../../types/userRoleType";

interface UserProfileOptionsProps {
  profiles: UserRole[];
  onChange: (profiles: UserRole[]) => void;
  lockedProfiles?: UserRole[];
}

const descriptions: Record<UserRole, string> = {
  STUDENT: "Perfil exclusivo para estudantes.",
  ADVISOR: "Gerencia projetos e orientandos.",
  EVALUATOR: "Participa das avaliações e bancas.",
  LOCAL_COMMITTEE: "Exige também o perfil Orientador.",
  TECHNICAL_SUPPORT: "Perfil exclusivo para apoio operacional.",
  ADMIN: "Perfil exclusivo para administração do sistema.",
};

export function UserProfileOptions({
  profiles,
  onChange,
  lockedProfiles = [],
}: UserProfileOptionsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {USER_ROLE_OPTIONS.map(({ value, label }) => {
        const checked = profiles.includes(value);
        const required =
          value === "ADVISOR" && profiles.includes("LOCAL_COMMITTEE");
        const locked = lockedProfiles.includes(value);
        const disabled = required || locked;

        return (
          <label
            key={value}
            className={`flex gap-3 rounded-xl border p-4 transition-colors ${disabled ? "cursor-not-allowed border-slate-200 bg-slate-50" : checked ? "cursor-pointer border-[#9bb4c2] bg-[#f2f6f8]" : "cursor-pointer border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"}`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(toggleUserRole(profiles, value))}
              className="mt-1 h-4 w-4 cursor-pointer accent-[#143c54] disabled:cursor-not-allowed"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-800">
                {label}
                {required && (
                  <span className="ml-2 text-xs font-normal text-[#143c54]">
                    Obrigatório
                  </span>
                )}
                {locked && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    Gerenciado pelo SISPROJ
                  </span>
                )}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                {descriptions[value]}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
