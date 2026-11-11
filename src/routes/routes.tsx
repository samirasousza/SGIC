import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Role, Screen } from "../pages/Login/LoginTypes";

import { LoginPage } from "../pages/Login/Login";
import { HomePage } from "../pages/Home/Home";
import { ProjectsPage } from "../pages/Projects/Projects";
import { ProjectDetail } from "../pages/Projects/ProjectDetails";

import { AppLayout } from "../components/AppLayout";
import { ReportsPage } from "../pages/Reports/Reports";
import { ProjectReportsDetail } from "../pages/Reports/ReportsDetail";
import { EvaluationsPage } from "../pages/Evalutions/Evaluations";
import { ProjectEvaluationDetail } from "../pages/Evalutions/EvaluationDetail";
import { EvaluatorsPage } from "../pages/Evaluaters/Evaluaters";
import { SpreadsheetsPage } from "../pages/Spreadsheets/Spreadsheets";
import { useUser } from "../contexts/userContext";
import { clearSession } from "../config/apiConfig";

// Definidos FORA do AppRoutes: se ficarem dentro, o React recria o componente
// a cada render e toda a árvore de rotas é desmontada/remontada.

function ScreenLoading() {
  return (
    <div className="grid min-h-screen place-items-center">Carregando...</div>
  );
}

// Só deixa passar quem está autenticado
function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) return <ScreenLoading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
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

  const [role, setRole] = useState<Role>("Orientador");
  const [screen, setScreen] = useState<Screen>("overview");
  const [accountRole] = useState<Role>("Avaliador");
  const [cycle, setCycle] = useState("2025–2026");

  function logout() {
    clearSession(); // remove token e flags de sessão
    clearUser(); // zera o usuário no contexto
    navigate("/login", { replace: true });
  }

  const layoutProps = {
    role,
    accountRole,
    setRole,
    screen,
    setScreen,
    cycle,
    setCycle,
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
          <Route path="/project" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />

          <Route
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
        </Route>
      </Route>

      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
