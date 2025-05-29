import api from "./api";
import authService from "./authService"

const inscripcionService = {
  // Obtener inscripciones del usuario actual
  getMisInscripciones: async () => {
    try {
      const response = await api.get("/inscripciones/mis-inscripciones");
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis inscripciones:", error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener inscripciones por evento (solo para instructores y admin)
  getByEvento: async (eventoId) => {
    try {
      const response = await api.get(`/inscripciones/evento/${eventoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener inscripciones del evento:", error.response?.data || error.message);
      throw error;
    }
  },
  

  // Crear nueva inscripción a evento
 // inscripcionService.js
inscribirEvento: async (eventoId) => {
  try {
    const response = await api.post("/inscripciones", { evento_id: eventoId });
    return response.data;
  } catch (error) {
    console.error("Error al inscribirse al evento:", error.response?.data || error.message);
    throw error; // Propaga el error al componente
  }
},

  // Inscribirse a un curso
  inscribirCurso: async (cursoId, datos) => {
    try {
      const token = authService.getToken(); // función que recupera el JWT
  
      console.log("Datos enviados al backend:", {
        curso_id: cursoId,
        fecha_preferida: datos.fecha_preferida,
        comentarios: datos.comentarios,
      });
  
      const response = await api.post(
        "/inscripciones/curso",
        {
          curso_id: cursoId,
          fecha_preferida: datos.fecha_preferida,
          comentarios: datos.comentarios,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error al inscribirse al curso:", error.response?.data || error.message);
      throw error;
    }
  },

  // Actualizar estado de inscripción (solo para instructores y admin)
  updateEstado: async (id, estado) => {
    try {
      const response = await api.put(`/inscripciones/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estado de inscripción:", error.response?.data || error.message);
      throw error;
    }
  },

  // Cancelar inscripción
  cancelar: async (id, tipo) => {
    try {
      const response = await api.delete(`/inscripciones/${id}`, {
        data: { tipo }, // Enviar el tipo al backend
      });
      return response.data;
    } catch (error) {
      console.error("Error al cancelar inscripción:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default inscripcionService;