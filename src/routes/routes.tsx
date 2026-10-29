import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login/Login";
import { HomePage } from "../pages/Home/Home";
import { AppLayout } from "../components/AppLayout";
import { useState } from "react";
import type { Role } from "../pages/Login/LoginTypes";

export function AppRoutes() {
  const [role, setRole] = useState<Role>("Aluno");
  const [accountRole, setAccountRole] = useState<Role>("Avaliador");
  const [screen, setScreen] = useState<Screen>("overview");
  const [cycle, setCycle] = useState("2025–2026");

  function logout() {
    // Substitua pela sua lógica de logout.
    window.location.href = "/login";
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <AppLayout
            role={role}
            accountRole={accountRole}
            setRole={setRole}
            screen={screen}
            setScreen={setScreen}
            cycle={cycle}
            setCycle={setCycle}
            logout={logout}
          >
            <HomePage />
          </AppLayout>
        }
      />

      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
