import api from "./api";

// api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
});




const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Verificar si el usuario tiene un rol específico
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return user.rol === role;
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // ✅ NUEVO: Obtener el token JWT directamente
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;

