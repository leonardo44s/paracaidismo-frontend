import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

// Función para subir imágenes al servidor
const uploadImage = async (file) => {
  if (!file) return null

  // Crear un FormData para enviar el archivo
  const formData = new FormData()
  formData.append("image", file)

  try {
    const token = localStorage.getItem("token")

    const response = await axios.post(`${API_URL}/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.imageUrl
  } catch (error) {
    console.error("Error al subir imagen:", error)
    throw new Error("No se pudo subir la imagen. " + (error.response?.data?.message || ""))
  }
}

// Función para eliminar una imagen del servidor
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return false

  try {
    const token = localStorage.getItem("token")
    // Extraer el nombre del archivo de la URL
    const filename = imageUrl.split("/").pop()

    await axios.delete(`${API_URL}/upload/image/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return true
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    throw new Error("No se pudo eliminar la imagen")
  }
}

// Exportamos las funciones como un objeto (exportación por defecto)
const uploadService = {
  uploadImage,
  deleteImage,
}

export default uploadService
