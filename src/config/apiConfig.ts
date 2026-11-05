import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// temporary. we need a better way to organize all of our routes.
// remember to change this in the future
const PUBLIC_PATHS = new Set(["/login"]);

export const api = axios.create({
  baseURL: API_BASE_URL,
});

const logout = () => {
  localStorage.clear();
  sessionStorage.removeItem("hasSeenPasswordPopup");
};

const redirectToLogin = () => {
  window.location.replace("/");
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
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isOnPublicPath = PUBLIC_PATHS.has(window.location.pathname);

    // 401 indicates unauthenticated
    if (!isOnPublicPath && error.response?.status === 401) {
      logout();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
