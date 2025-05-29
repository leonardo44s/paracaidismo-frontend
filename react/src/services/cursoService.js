import api from "./api"

const cursoService = {
  // Obtener todos los cursos
  getAll: async () => {
    const response = await api.get("/cursos")
    return response.data
  },

  // Obtener curso por ID
  getById: async (id) => {
    const response = await api.get(`/cursos/${id}`)
    return response.data
  },

  // Crear nuevo curso (admin e instructor)
  create: async (cursoData) => {
    const response = await api.post("/cursos", cursoData)
    return response.data
  },

  // Actualizar curso
  update: async (id, cursoData) => {
    const response = await api.put(`/cursos/${id}`, cursoData)
    return response.data
  },

  // Eliminar curso (solo admin)
  delete: async (id) => {
    const response = await api.delete(`/cursos/${id}`)
    return response.data
  },
}

export default cursoService
