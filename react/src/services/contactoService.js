import api from "./api"

const contactoService = {
  // Enviar mensaje de contacto (público)
  create: async (contactoData) => {
    const response = await api.post("/contacto", contactoData)
    return response.data
  },

  // Obtener todos los mensajes (solo admin)
  getAll: async () => {
    const response = await api.get("/contacto")
    return response.data
  },

  // Obtener mensajes no leídos (solo admin)
  getNoLeidos: async () => {
    const response = await api.get("/contacto/no-leidos")
    return response.data
  },

  // Obtener mensaje por ID (solo admin)
  getById: async (id) => {
    const response = await api.get(`/contacto/${id}`)
    return response.data
  },

  // Marcar mensaje como leído (solo admin)
  marcarLeido: async (id) => {
    const response = await api.put(`/contacto/${id}/leido`)
    return response.data
  },

  // Eliminar mensaje (solo admin)
  delete: async (id) => {
    const response = await api.delete(`/contacto/${id}`)
    return response.data
  },
}

export default contactoService
