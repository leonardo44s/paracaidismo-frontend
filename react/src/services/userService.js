import api from "./api"

const userService = {
  // Obtener todos los usuarios (solo admin)
  getAll: async () => {
    try {
      const response = await api.get("/users")
      return response.data
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      throw error
    }
  },

  // Obtener usuario por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error)
      throw error
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error)
      throw error
    }
  },

  // Cambiar contraseña
  updatePassword: async (id, passwordData) => {
    try {
      const response = await api.put(`/users/${id}/password`, passwordData)
      return response.data
    } catch (error) {
      console.error(`Error al cambiar contraseña del usuario con ID ${id}:`, error)
      throw error
    }
  },

  // Eliminar usuario (solo admin)
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error)
      throw error
    }
  },
}

export default userService
