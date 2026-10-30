import { Routes, Route } from "react-router-dom";
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

export function AppRoutes() {
  const [role, setRole] = useState<Role>("Orientador");
  const [screen, setScreen] = useState<Screen>("overview");
  const [accountRole] = useState<Role>("Avaliador");
  const [cycle, setCycle] = useState("2025–2026");

  function logout() {
    window.location.href = "/login";
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
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <AppLayout {...layoutProps}>
            <HomePage />
          </AppLayout>
        }
      />

      <Route
        path="/project"
        element={
          <AppLayout {...layoutProps}>
            <ProjectsPage />
          </AppLayout>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <AppLayout {...layoutProps}>
            <ProjectDetail />
          </AppLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <AppLayout {...layoutProps}>
            <ReportsPage role={role} accountRole={accountRole} cycle={cycle} />
          </AppLayout>
        }
      />

      <Route
        path="/projects/:projectId/reports"
        element={
          <AppLayout {...layoutProps}>
            <ProjectReportsDetail role={role} />
          </AppLayout>
        }
      />

      <Route
        path="/evaluations"
        element={
          <AppLayout {...layoutProps}>
            <EvaluationsPage cycle={cycle} />
          </AppLayout>
        }
      />

      <Route
        path="/projects/:projectId/evaluations"
        element={
          <AppLayout {...layoutProps}>
            <ProjectEvaluationDetail role={role} />
          </AppLayout>
        }
      />

      <Route
        path="/projects/:projectId/evaluators"
        element={
          <AppLayout {...layoutProps}>
            <EvaluatorsPage role={layoutProps.role} />
          </AppLayout>
        }
      />

      <Route
        path="/spreadsheets"
        element={
          <AppLayout {...layoutProps}>
            <SpreadsheetsPage role={layoutProps.role} cycle={cycle} />
          </AppLayout>
        }
      />

      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
