import api from "./api"

const infoService = {
  // Obtener información de una sección
  getInfo: async (seccion) => {
    const response = await api.get(`/info/${seccion}`)
    return response.data
  },

  // Obtener todas las secciones
  getAllSections: async () => {
    const response = await api.get("/info")
    return response.data
  },

  // Actualizar información (solo admin)
  updateInfo: async (seccion, contenido) => {
    const response = await api.put(`/info/${seccion}`, { contenido })
    return response.data
  },
}

export default infoService
