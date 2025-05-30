import axios from "axios"

// Crear una instancia de axios con la URL base desde variable de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
})

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Si el error es 401 (No autorizado), redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api