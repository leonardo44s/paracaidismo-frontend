import api from "./api";

const resenaService = {
  // Obtener todas las reseñas aprobadas
  getAllResenas: async () => {
    try {
      const response = await api.get("/resenas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      throw error;
    }
  },

  // Obtener reseñas por curso
  getResenasByCurso: async (cursoId) => {
    try {
      const response = await api.get(`/resenas/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reseñas del curso ${cursoId}:`, error);
      throw error;
    }
  },

  // Obtener mis reseñas
  getMisResenas: async () => {
    try {
      const response = await api.get("/resenas/mis-resenas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis reseñas:", error);
      throw error;
    }
  },

  // Obtener cursos disponibles para reseñar
  getCursosDisponibles: async () => {
    try {
      const response = await api.get("/resenas/cursos-disponibles");
      return response.data;
    } catch (error) {
      console.error("Error al obtener cursos disponibles para reseñar:", error);
      throw error;
    }
  },

  // Crear una reseña (usando createResena)
  createResena: async (resenaData) => {
    try {
      const response = await api.post("/resenas", resenaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear reseña:", error);
      throw error;
    }
  },

  // Eliminar una reseña
  deleteResena: async (resenaId) => {
    try {
      const response = await api.delete(`/resenas/${resenaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar reseña ${resenaId}:`, error);
      throw error;
    }
  },

  // Obtener reseñas pendientes (admin)
  getResenasPendientes: async () => {
    try {
      const response = await api.get("/resenas/pendientes");
      return response.data;
    } catch (error) {
      console.error("Error al obtener reseñas pendientes:", error);
      throw error;
    }
  },

  // Aprobar una reseña (admin)
  aprobarResena: async (resenaId) => {
    try {
      const response = await api.put(`/resenas/${resenaId}/aprobar`);
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar reseña ${resenaId}:`, error);
      throw error;
    }
  },

  // Rechazar una reseña (admin)
  rechazarResena: async (resenaId, motivo) => {
    try {
      const response = await api.put(`/resenas/${resenaId}/rechazar`, { motivo });
      return response.data;
    } catch (error) {
      console.error(`Error al rechazar reseña ${resenaId}:`, error);
      throw error;
    }
  }
};

export default resenaService;