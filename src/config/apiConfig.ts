import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LOGIN_PATH = "/login";

// Rotas do front onde um 401 é esperado e não deve redirecionar
const PUBLIC_PATHS = new Set([LOGIN_PATH]);

// Endpoints onde 401 significa "credencial errada", não "sessão expirada"
// (ex.: senha atual incorreta em /auth/change-password)
const isAuthEndpoint = (url?: string) => !!url && url.startsWith("/auth/");

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Exportado para ser usado também no logout manual (routes.tsx)
export const clearSession = () => {
  localStorage.clear();
  sessionStorage.removeItem("hasSeenPasswordPopup");
};

const redirectToLogin = () => {
  window.location.replace(LOGIN_PATH);
};

// ------------------ interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isOnPublicPath = PUBLIC_PATHS.has(window.location.pathname);
    const isUnauthorized = error.response?.status === 401;

    // 401 em rota protegida = token ausente/expirado → encerra a sessão
    if (
      isUnauthorized &&
      !isOnPublicPath &&
      !isAuthEndpoint(error.config?.url)
    ) {
      clearSession();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
