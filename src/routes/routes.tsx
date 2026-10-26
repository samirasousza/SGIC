import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/Login/Login";

export function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}
