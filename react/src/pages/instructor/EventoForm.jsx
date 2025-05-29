"use client"

import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import eventoService from "../../services/eventoService"
import authService from "../../services/authService"

const EventoForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    capacidad: "",
    instructor_id: "",
  })

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    // Si estamos editando, cargar los datos del evento
    if (isEditing) {
      const fetchEvento = async () => {
        try {
          const data = await eventoService.getById(id)

          // Formatear la fecha para el input date (YYYY-MM-DD)
          const fecha = new Date(data.fecha)
          const fechaFormateada = fecha.toISOString().split("T")[0]

          setFormData({
            titulo: data.titulo,
            descripcion: data.descripcion || "",
            fecha: fechaFormateada,
            hora: data.hora,
            lugar: data.lugar,
            capacidad: data.capacidad,
            instructor_id: data.instructor_id || currentUser.id,
          })

          setLoading(false)
        } catch (error) {
          console.error("Error al cargar evento:", error)
          setError("Error al cargar los datos del evento. Por favor, intenta de nuevo más tarde.")
          setLoading(false)
        }
      }

      fetchEvento()
    } else {
      // Si es un nuevo evento, establecer el instructor_id al usuario actual
      setFormData({
        ...formData,
        instructor_id: currentUser.id,
      })
    }
  }, [id, isEditing, currentUser.id])

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

    try {
      if (isEditing) {
        await eventoService.update(id, formData)
        alert("Evento actualizado con éxito")
      } else {
        await eventoService.create(formData)
        alert("Evento creado con éxito")
      }

      navigate("/mis-eventos")
    } catch (error) {
      console.error("Error al guardar evento:", error)
      setError(
        error.response?.data?.message ||
          `Error al ${isEditing ? "actualizar" : "crear"} el evento. Por favor, intenta de nuevo.`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="mb-4">{isEditing ? "Editar Evento" : "Crear Nuevo Evento"}</h1>

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="titulo">
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="hora">
              <Form.Label>Hora</Form.Label>
              <Form.Control type="time" name="hora" value={formData.hora} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lugar">
              <Form.Label>Lugar</Form.Label>
              <Form.Control type="text" name="lugar" value={formData.lugar} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="capacidad">
              <Form.Label>Capacidad (número de personas)</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                required
                min="1"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate("/mis-eventos")}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : isEditing ? "Actualizar Evento" : "Crear Evento"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default EventoForm
