"use client"

import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "../styles/crear-curso.css"

const API_URL = "http://localhost:3001/api"

const CrearCurso = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  // Estado para el formulario
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    nivel: "principiante",
    duracion: "",
    precio: "",
    instructor_id: "",
  })

  // Estado para la imagen
  const [imagen, setImagen] = useState(null)
  const [imagenPreview, setImagenPreview] = useState("")

  // Estados para UI
  const [instructores, setInstructores] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingInstructores, setLoadingInstructores] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Obtener token de autenticación
  const token = localStorage.getItem("token")

  // Configuración para axios
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // Configuración para axios con FormData
  const configFormData = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  // Cargar instructores
  useEffect(() => {
    const cargarInstructores = async () => {
      try {
        setLoadingInstructores(true)
        const res = await axios.get(`${API_URL}/users?rol=instructor`, config)
        setInstructores(res.data)
        console.log("Instructores cargados:", res.data)
        setLoadingInstructores(false)
      } catch (err) {
        console.error("Error al cargar instructores:", err)
        setError("Error al cargar instructores. Por favor, recarga la página.")
        setLoadingInstructores(false)
      }
    }

    cargarInstructores()
  }, [])

  // Cargar curso si estamos editando
  useEffect(() => {
    const cargarCurso = async () => {
      if (isEditing) {
        setLoading(true)
        try {
          const res = await axios.get(`${API_URL}/cursos/${id}`, config)
          setFormData({
            titulo: res.data.titulo || "",
            descripcion: res.data.descripcion || "",
            nivel: res.data.nivel || "principiante",
            duracion: res.data.duracion || "",
            precio: res.data.precio || "",
            instructor_id: res.data.instructor_id ? res.data.instructor_id.toString() : "",
          })

          if (res.data.imagen) {
            setImagenPreview(res.data.imagen)
          }
        } catch (err) {
          console.error("Error al cargar curso:", err)
          setError("Error al cargar los datos del curso. Por favor, intenta de nuevo.")
        } finally {
          setLoading(false)
        }
      }
    }

    cargarCurso()
  }, [id, isEditing])

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Crear FormData para enviar datos e imagen
      const data = new FormData()

      // Añadir todos los campos del formulario
      data.append("titulo", formData.titulo)
      data.append("descripcion", formData.descripcion)
      data.append("nivel", formData.nivel)
      data.append("duracion", formData.duracion)
      data.append("precio", formData.precio)
      data.append("instructor_id", formData.instructor_id)

      // Si hay una imagen nueva, añadirla
      if (imagen) {
        data.append("imagen", imagen)
      }

      console.log("Datos a enviar:", {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        nivel: formData.nivel,
        duracion: formData.duracion,
        precio: formData.precio,
        instructor_id: formData.instructor_id,
      })

      if (isEditing) {
        await axios.put(`${API_URL}/cursos/${id}`, data, configFormData)
        setSuccess("¡Curso actualizado con éxito!")
      } else {
        await axios.post(`${API_URL}/cursos`, data, configFormData)
        setSuccess("¡Curso creado con éxito!")
        // Limpiar formulario
        setFormData({
          titulo: "",
          descripcion: "",
          nivel: "principiante",
          duracion: "",
          precio: "",
          instructor_id: "",
        })
        setImagen(null)
        setImagenPreview("")
      }

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/cursos")
      }, 2000)
    } catch (err) {
      console.error("Error al guardar curso:", err)
      setError(err.response?.data?.message || "Error al guardar el curso. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos del curso...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5">
      <Card className="shadow border-0">
        <Card.Header className="bg-primary text-white py-3">
          <h2 className="mb-0 text-center">{isEditing ? "Editar Curso" : "Crear Nuevo Curso"}</h2>
        </Card.Header>
        <Card.Body className="p-4">
          {error && (
            <Alert variant="danger" className="mb-4">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Título del Curso</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ej: Curso Básico de Paracaidismo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe detalladamente el contenido del curso..."
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nivel</Form.Label>
                      <Form.Select name="nivel" value={formData.nivel} onChange={handleChange} required>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duración</Form.Label>
                      <Form.Control
                        type="text"
                        name="duracion"
                        value={formData.duracion}
                        onChange={handleChange}
                        placeholder="Ej: 2 días, 16 horas"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="Ej: 299.99"
                        min="0"
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Instructor</Form.Label>
                  {loadingInstructores ? (
                    <div className="d-flex align-items-center">
                      <Spinner animation="border" size="sm" className="me-2" />
                      <span>Cargando instructores...</span>
                    </div>
                  ) : (
                    <>
                      <Form.Select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required>
                        <option value="">Seleccionar instructor</option>
                        {instructores.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.nombre} {instructor.apellido} (ID: {instructor.id})
                          </option>
                        ))}
                      </Form.Select>
                      {instructores.length === 0 && (
                        <Alert variant="warning" className="mt-2">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          No hay instructores disponibles. Por favor, contacta al administrador.
                        </Alert>
                      )}
                    </>
                  )}
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Imagen del Curso</Form.Label>
                  <div
                    className="image-preview mb-3"
                    style={{
                      height: "200px",
                      border: "1px dashed #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundImage: imagenPreview ? `url(${imagenPreview})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("imagen-input").click()}
                  >
                    {!imagenPreview && (
                      <div className="text-center text-muted">
                        <i className="fas fa-image fa-3x mb-2"></i>
                        <p>Haz clic para seleccionar una imagen</p>
                      </div>
                    )}
                  </div>

                  <Form.Control
                    id="imagen-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    style={{ display: "none" }}
                  />

                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => document.getElementById("imagen-input").click()}
                    disabled={uploadingImage}
                  >
                    <i className="fas fa-upload me-2"></i>
                    {imagenPreview ? "Cambiar imagen" : "Subir imagen"}
                  </Button>

                  {imagenPreview && (
                    <Button
                      variant="outline-danger"
                      className="w-100 mt-2"
                      onClick={() => {
                        setImagen(null)
                        setImagenPreview("")
                      }}
                      disabled={uploadingImage}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Eliminar imagen
                    </Button>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/cursos")}
                disabled={loading || uploadingImage}
              >
                <i className="fas fa-times me-1"></i> Cancelar
              </Button>

              <Button variant="primary" type="submit" disabled={loading || uploadingImage}>
                {loading || uploadingImage ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    {uploadingImage ? "Subiendo imagen..." : isEditing ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isEditing ? "fa-save" : "fa-plus-circle"} me-1`}></i>
                    {isEditing ? "Guardar Cambios" : "Crear Curso"}
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CrearCurso
