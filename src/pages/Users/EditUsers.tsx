
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import type { UserModel } from "../../models/userModel";
// import {
//   activateUser,
//   deactivateUser,
//   updateUserRoles,
// } from "../../services/userService";

// import { UserProfileOptions } from "../../components/Users/UserProfileOptions";
// import { UserStatusBadge } from "../../components/Users/UserStatusBadge";

// export function UserEditPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [user, setUser] = useState<UserModel | null>(null);
//   const [roles, setRoles] = useState<UserModel["roles"]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadUser() {
//       if (!id) return;

//       try {
//         const data = await getUserById(id);
//         setUser(data);
//         setRoles(data.roles);
//       } catch {
//         setError("Não foi possível carregar os dados do usuário.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     void loadUser();
//   }, [id]);

//   async function handleSaveRoles() {
//     if (!user) return;

//     try {
//       setSaving(true);
//       setError("");

//       const updated = await updateUserRoles(user.id, roles);
//       setUser(updated);
//       setRoles(updated.roles);
//     } catch {
//       setError("Não foi possível atualizar os perfis.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function handleToggleAccess() {
//     if (!user) return;

//     try {
//       setSaving(true);

//       if (user.active) {
//         await deactivateUser(user.id);
//       } else {
//         await activateUser(user.id);
//       }

//       const updated = await getUserById(user.id);
//       setUser(updated);
//     } catch {
//       setError("Não foi possível alterar o acesso.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return <p className="py-10 text-center text-gray-500">Carregando...</p>;
//   }

//   if (!user) {
//     return (
//       <div className="rounded-xl border bg-white p-8 text-center">
//         <p className="text-gray-700">
//           {error || "Usuário não encontrado."}
//         </p>
//         <button
//           onClick={() => navigate("/users")}
//           className="mt-4 text-sm text-blue-700"
//         >
//           Voltar para usuários
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <header>
//         <button
//           onClick={() => navigate("/users")}
//           className="mb-3 text-sm text-blue-700 hover:underline"
//         >
//           ← Voltar para usuários
//         </button>

//         <p className="text-sm font-medium text-blue-700">
//           Administração de acesso
//         </p>
//         <h1 className="mt-1 text-2xl font-bold text-gray-900">
//           Editar usuário
//         </h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Consulte os dados e gerencie as permissões de acesso.
//         </p>
//       </header>

//       <section className="rounded-xl border bg-white p-6">
//         <div className="flex flex-col justify-between gap-4 sm:flex-row">
//           <div>
//             <h2 className="text-lg font-semibold">{user.name}</h2>
//             <p className="text-sm text-gray-500">{user.email}</p>
//           </div>
//           <UserStatusBadge active={user.active} />
//         </div>

//         <div className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-2">
//           <div>
//             <p className="text-xs text-gray-500">CPF</p>
//             <p className="mt-1 text-sm">{user.cpf || "Não informado"}</p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500">Telefone</p>
//             <p className="mt-1 text-sm">{user.phone || "Não informado"}</p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500">Matrícula / registro</p>
//             <p className="mt-1 text-sm">{user.registration || "Não informado"}</p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500">Curso</p>
//             <p className="mt-1 text-sm">{user.course?.name || "Não informado"}</p>
//           </div>
//         </div>
//       </section>

//       <section className="rounded-xl border bg-white p-6">
//         <h2 className="font-semibold text-gray-900">
//           Perfis e permissões
//         </h2>
//         <p className="mt-1 text-sm text-gray-500">
//           Altere os perfis de acesso do usuário.
//         </p>

//         <div className="mt-5">
//           <UserProfileOptions profiles={roles} onChange={setRoles} />
//         </div>

//         <div className="mt-5 flex justify-end">
//           <button
//             onClick={handleSaveRoles}
//             disabled={saving || !roles.length}
//             className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
//           >
//             {saving ? "Salvando..." : "Salvar perfis"}
//           </button>
//         </div>
//       </section>

//       <section className="rounded-xl border border-gray-200 bg-white p-6">
//         <h2 className="font-semibold text-gray-900">Acesso ao sistema</h2>
//         <p className="mt-1 text-sm text-gray-500">
//           {user.active
//             ? "Este usuário está habilitado para acessar o sistema."
//             : "Este usuário está com o acesso desativado."}
//         </p>

//         <button
//           onClick={handleToggleAccess}
//           disabled={saving}
//           className={`mt-4 rounded-lg px-4 py-2.5 text-sm font-medium ${
//             user.active
//               ? "border border-red-200 text-red-700 hover:bg-red-50"
//               : "bg-green-700 text-white hover:bg-green-800"
//           }`}
//         >
//           {user.active ? "Desativar acesso" : "Reativar acesso"}
//         </button>
//       </section>

//       {error && (
//         <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }
