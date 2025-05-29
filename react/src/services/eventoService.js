import api from "./api"

const eventoService = {
  // Obtener todos los eventos
  getAll: async () => {
    try {
      const response = await api.get("/eventos")
      return response.data
    } catch (error) {
      console.error("Error al obtener eventos:", error)
      throw error
    }
  },
  

  // Obtener evento por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/eventos/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener evento con ID ${id}:`, error)
      throw error
    }
  },

  // Obtener eventos por instructor
  getByInstructor: async (instructorId) => {
    try {
      const response = await api.get(`/eventos/instructor/${instructorId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener eventos del instructor ${instructorId}:`, error)
      throw error
    }
  },

  // Crear nuevo evento
  create: async (eventoData) => {
    try {
      const response = await api.post("/eventos", eventoData)
      return response.data
    } catch (error) {
      console.error("Error al crear evento:", error)
      throw error
    }
  },

  // Actualizar evento
  update: async (id, eventoData) => {
    try {
      const response = await api.put(`/eventos/${id}`, eventoData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar evento ${id}:`, error)
      throw error
    }
  },

  // Eliminar evento
  delete: async (id) => {
    try {
      const response = await api.delete(`/eventos/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar evento ${id}:`, error)
      throw error
    }
  },
}

export default eventoService
