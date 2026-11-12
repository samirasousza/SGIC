import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { LoginPage } from "../pages/Login/Login";
import { HomePage } from "../pages/Home/Home";
import { ProjectsPage } from "../pages/Projects/Projects";
import { ProjectDetail } from "../pages/Projects/ProjectDetails";
import { EvaluatorsPage } from "../pages/Evaluaters/Evaluaters";


import { useUser } from "../contexts/userContext";
import { clearSession } from "../config/apiConfig";
import { CompleteStudentProfile } from "../pages/UserProfile/CompleteUserProfile";
import { ChangePasswordPage } from "../pages/ChangePassword/ChangePassword";
import { AppLayout } from "../components/Layout/AppLayout";
import { UsersPage } from "../pages/Users/Users";
import { UserAddPage } from "../pages/Users/RegisterUsers";
// import { UserEditPage } from "../pages/Users/EditUsers";
import { PendingUsersPage } from "../pages/Users/PedingUsers";
import { SettingsPage } from "../pages/Settings/Settings";

function ScreenLoading() {
  return (
    <div className="grid min-h-screen place-items-center">Carregando...</div>
  );
}

// Só permite a entrada de usuários autenticados.
function ProtectedRoute() {
  const { user, loading, refreshUser, clearUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <ScreenLoading />;
  if (!user) return <Navigate to="/login" replace />;

  const isStudent = user.roles.includes("STUDENT");
  const needsProfileCompletion = isStudent && !user.profileCompleted;

  function handleCancelProfile() {
    clearSession();
    clearUser();
    navigate("/login", { replace: true });
  }

  if (needsProfileCompletion && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />

      {needsProfileCompletion && (
        <CompleteStudentProfile
          onCompleted={async () => {
            await refreshUser();
          }}
          onCancel={handleCancelProfile}
        />
      )}
    </>
  );
}

// Só permite a entrada de usuários administradores.
function AdminRoute() {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.roles.includes("ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Quem já está logado não precisa ver a tela de login.
function PublicOnlyRoute() {
  const { user, loading } = useUser();

  if (loading) return <ScreenLoading />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}

export function AppRoutes() {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  function logout() {
    clearSession();
    clearUser();
    navigate("/login", { replace: true });
  }

  const layoutProps = {
    logout,
  };

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppLayout {...layoutProps}>
              <Outlet />
            </AppLayout>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route
            path="/projects/:projectId/evaluators"
            element={<EvaluatorsPage />}
          />

          {/* Rotas administrativas: somente ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/user-add" element={<UserAddPage />} />
            {/* <Route path="/user-edit/:id" element={<UserEditPage />} /> */}
            <Route path="/pending-users" element={<PendingUsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
