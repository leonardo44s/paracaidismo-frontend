"use client"

import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import cursoService from "../../services/cursoService"
import userService from "../../services/userService"
import authService from "../../services/authService"

const FormularioCurso = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    nivel: "principiante",
    duracion: "",
    precio: "",
    instructor_id: "",
    imagen: "",
  })

  const [instructores, setInstructores] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    // Cargar lista de instructores
    const fetchInstructores = async () => {
      try {
        const users = await userService.getAll()
        const instructoresList = users.filter((user) => user.rol === "instructor")
        setInstructores(instructoresList)

        // Si el usuario actual es instructor, seleccionarlo por defecto
        if (authService.hasRole("instructor") && !isEditing) {
          setFormData((prev) => ({
            ...prev,
            instructor_id: currentUser.id,
          }))
        }
      } catch (error) {
        console.error("Error al cargar instructores:", error)
      }
    }

    fetchInstructores()

    // Si estamos editando, cargar los datos del curso
    if (isEditing) {
      const fetchCurso = async () => {
        try {
          const data = await cursoService.getById(id)
          setFormData({
            titulo: data.titulo,
            descripcion: data.descripcion,
            nivel: data.nivel,
            duracion: data.duracion,
            precio: data.precio,
            instructor_id: data.instructor_id || "",
            imagen: data.imagen || "",
          })
          setLoading(false)
        } catch (error) {
          console.error("Error al cargar curso:", error)
          setError("Error al cargar los datos del curso. Por favor, intenta de nuevo más tarde.")
          setLoading(false)
        }
      }

      fetchCurso()
    } else {
      setLoading(false)
    }
  }, [id, isEditing, currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (isEditing) {
        await cursoService.update(id, formData)
        setSuccess("Curso actualizado con éxito")
      } else {
        await cursoService.create(formData)
        setSuccess("Curso creado con éxito")
        // Limpiar formulario después de crear
        setFormData({
          titulo: "",
          descripcion: "",
          nivel: "principiante",
          duracion: "",
          precio: "",
          instructor_id: currentUser.rol === "instructor" ? currentUser.id : "",
          imagen: "",
        })
      }
    } catch (error) {
      console.error("Error al guardar curso:", error)
      setError("Error al guardar el curso. Por favor, verifica todos los campos e intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container className="py-5 animate__animated animate__fadeIn">
      <h1 className="mb-4 text-center">{isEditing ? "Editar Curso" : "Crear Nuevo Curso"}</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-lg border-0 rounded-lg">
        <Card.Body className="p-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="titulo">
              <Form.Label>Título del Curso</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="form-control-lg"
                placeholder="Ej: Curso Básico de Paracaidismo"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                placeholder="Describe detalladamente el contenido del curso..."
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3" controlId="nivel">
                  <Form.Label>Nivel</Form.Label>
                  <Form.Select name="nivel" value={formData.nivel} onChange={handleChange} required>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3" controlId="duracion">
                  <Form.Label>Duración</Form.Label>
                  <Form.Control
                    type="text"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 2 días, 16 horas"
                  />
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3" controlId="precio">
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Ej: 299.99"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3" controlId="instructor_id">
              <Form.Label>Instructor</Form.Label>
              <Form.Select
                name="instructor_id"
                value={formData.instructor_id}
                onChange={handleChange}
                required
                disabled={authService.hasRole("instructor") && !authService.hasRole("admin")}
              >
                <option value="">Seleccionar instructor</option>
                {instructores.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.nombre} {instructor.apellido}
                  </option>
                ))}
              </Form.Select>
              {authService.hasRole("instructor") && !authService.hasRole("admin") && (
                <Form.Text className="text-muted">
                  Como instructor, solo puedes crear cursos asignados a ti mismo.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-4" controlId="imagen">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <Form.Text className="text-muted">
                Ingresa la URL de una imagen para el curso. Deja en blanco para usar una imagen predeterminada.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button
                variant="secondary"
                onClick={() => navigate("/cursos")}
                className="px-4 py-2"
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" className="px-4 py-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </>
                ) : isEditing ? (
                  "Actualizar Curso"
                ) : (
                  "Crear Curso"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default FormularioCurso
