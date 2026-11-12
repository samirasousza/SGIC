
import type { UserModel } from "../../models/userModel";
import { USER_ROLE_LABELS } from "../../types/userRoleType";
import { Icon } from "../Icon";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserTableProps {
  users: UserModel[];
  onEdit: (user: UserModel) => void;
}

export function UserTable({ users, onEdit }: UserTableProps) {
  if (!users.length) {
    return (
      <div className="py-12 text-center">
        <p className="font-medium text-gray-700">Nenhum usuário encontrado</p>
        <p className="mt-1 text-sm text-gray-500">
          Tente alterar os filtros da pesquisa.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
            <th className="px-4 py-3">Usuário</th>
            <th className="px-4 py-3">Perfis e funções</th>
            <th className="px-4 py-3">Unidade</th>
            <th className="px-4 py-3">Acesso</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-50 hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 font-semibold text-blue-700">
                    <Icon name="user" size={19} />
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex max-w-xs flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {USER_ROLE_LABELS[role]}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-4 text-gray-600">
                {user.course?.unit?.acronym ?? "—"}
              </td>

              <td className="px-4 py-4">
                <UserStatusBadge active={user.active} />
              </td>

              <td className="px-4 py-4 text-right">
                <button
                  onClick={() => onEdit(user)}
                  className="cursor-pointer rounded-lg px-3 py-2 font-medium text-blue-700 hover:bg-blue-50"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
