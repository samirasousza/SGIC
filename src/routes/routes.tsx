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

import { AppLayout } from "../components/AppLayout";
// import { ReportsPage } from "../pages/Reports/Reports";
// import { ProjectReportsDetail } from "../pages/Reports/ReportsDetail";
// import { EvaluationsPage } from "../pages/Evalutions/Evaluations";
// import { ProjectEvaluationDetail } from "../pages/Evalutions/EvaluationDetail";
// import { EvaluatorsPage } from "../pages/Evaluaters/Evaluaters";
// import { SpreadsheetsPage } from "../pages/Spreadsheets/Spreadsheets";
import { useUser } from "../contexts/userContext";
import { clearSession } from "../config/apiConfig";
import { CompleteStudentProfile } from "../pages/UserProfile/CompleteUserProfile";
import { ChangePasswordPage } from "../pages/ChangePassword/ChangePassword";

// Definidos FORA do AppRoutes: se ficarem dentro, o React recria o componente
// a cada render e toda a árvore de rotas é desmontada/remontada.

function ScreenLoading() {
  return (
    <div className="grid min-h-screen place-items-center">Carregando...</div>
  );
}

// Só deixa passar quem está autenticado
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

// Quem já está logado não precisa ver a tela de login
function PublicOnlyRoute() {
  const { user, loading } = useUser();

  if (loading) return <ScreenLoading />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}

export function AppRoutes() {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  // const [role, setRole] = useState<UserRole>("");
  // const [screen, setScreen] = useState<Screen>("overview");
  // const [accountRole] = useState<UserRole>("");
  // const [cycle, setCycle] = useState("2025–2026");

  function logout() {
    clearSession(); // remove token e flags de sessão
    clearUser(); // zera o usuário no contexto
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

      {/* Rotas protegidas, todas dentro do mesmo layout */}
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

          {/* <Route
            path="/reports"
            element={
              <ReportsPage
                role={role}
                accountRole={accountRole}
                cycle={cycle}
              />
            }
          />
          <Route
            path="/projects/:projectId/reports"
            element={<ProjectReportsDetail role={role} />}
          />

          <Route
            path="/evaluations"
            element={<EvaluationsPage cycle={cycle} />}
          />
          <Route
            path="/projects/:projectId/evaluations"
            element={<ProjectEvaluationDetail role={role} />}
          />
          <Route
            path="/projects/:projectId/evaluators"
            element={<EvaluatorsPage role={role} />}
          />

          <Route
            path="/spreadsheets"
            element={<SpreadsheetsPage role={role} cycle={cycle} />}
          />
          */}
        </Route>
      </Route>

      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
