import type { UserModel } from "../../models/userModel";
import { USER_ROLE_LABELS } from "../../types/userRoleType";
import { Button } from "../Button";
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
        <p className="font-medium text-slate-700">Nenhum usuário encontrado</p>
        <p className="mt-1 text-sm text-slate-500">
          Tente alterar os filtros da pesquisa.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Usuário</th>
            <th className="px-4 py-3">Perfis e funções</th>
            <th className="px-4 py-3">Curso</th>
            <th className="px-4 py-3">Acesso</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf1f5] font-semibold text-[#143c54]">
                    <Icon name="user" size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">{user.name}</p>
                    <p className="break-all text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex max-w-xs flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {USER_ROLE_LABELS[role]}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-slate-600">
                {user.course?.name ?? "Não vinculado"}
              </td>
              <td className="px-4 py-4">
                <UserStatusBadge active={user.active} />
              </td>
              <td className="px-4 py-4 text-right">
                <Button variant="table" onClick={() => onEdit(user)}>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
