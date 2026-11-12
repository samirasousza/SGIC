
import type { UserRole } from "../../types/userRoleType";
import {
  USER_ROLE_OPTIONS,
  toggleUserRole,
} from "../../types/userRoleType";

interface UserProfileOptionsProps {
  profiles: UserRole[];
  onChange: (profiles: UserRole[]) => void;
}

const descriptions: Record<UserRole, string> = {
  STUDENT: "Perfil exclusivo para estudantes.",
  ADVISOR: "Gerencia projetos e orientandos.",
//   COADVISOR: "Acompanha projetos como coorientador.",
  EVALUATOR: "Participa das avaliações e bancas.",
  LOCAL_COMMITTEE: "Exige também o perfil Orientador.",
  TECHNICAL_SUPPORT: "Perfil exclusivo para apoio operacional.",
  ADMIN: "Perfil exclusivo para administração do sistema.",
};

export function UserProfileOptions({
  profiles,
  onChange,
}: UserProfileOptionsProps) {
  return (
    <div className="space-y-3">
      {USER_ROLE_OPTIONS.map(({ value, label }) => {
        const checked = profiles.includes(value);
        const required =
          value === "ADVISOR" && profiles.includes("LOCAL_COMMITTEE");

        return (
          <label
            key={value}
            className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
              checked
                ? "border-blue-300 bg-blue-50/50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={required}
              onChange={() =>
                onChange(toggleUserRole(profiles, value))
              }
              className="mt-1 h-4 w-4 accent-blue-600"
            />

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-800">
                {label}
                {required && (
                  <span className="ml-2 text-xs font-normal text-blue-700">
                    Obrigatório
                  </span>
                )}
              </span>

              <span className="mt-1 block text-xs text-gray-500">
                {descriptions[value]}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
