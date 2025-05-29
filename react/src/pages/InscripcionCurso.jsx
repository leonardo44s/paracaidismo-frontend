"use client"

import { useState } from "react"
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import cursoService from "../services/cursoService"
import inscripcionService from "../services/inscripcionService"
import authService from "../services/authService"

const InscripcionCurso = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [curso, setCurso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    fecha_preferida: "",
    comentarios: "",
  })

  const isAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const data = await cursoService.getById(id)
        setCurso(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar curso:", error)
        setError("Error al cargar los detalles del curso. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchCurso()
  }, [id])

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

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/cursos/${id}/inscripcion` } })
      return
    }

    try {
      await inscripcionService.inscribirCurso(id, formData)
      setSuccess("¡Inscripción realizada con éxito! Te contactaremos pronto para confirmar los detalles.")
      setFormData({
        fecha_preferida: "",
        comentarios: "",
      })
    } catch (error) {
      console.error("Error al realizar inscripción:", error)
      setError("Error al procesar la inscripción. Por favor, intenta de nuevo.")
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

  if (error && !curso) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5 animate__animated animate__fadeIn">
      <h1 className="mb-4 text-center">Inscripción al Curso</h1>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <Card className="shadow-lg border-0 rounded-lg h-100">
            <Card.Img
              variant="top"
              src={curso?.imagen || "/placeholder.svg?height=300&width=600"}
              alt={curso?.titulo}
              style={{ height: "250px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title className="fs-3 mb-3">{curso?.titulo}</Card.Title>
              <div className="mb-3">
                <span className="badge bg-primary me-2">{curso?.nivel}</span>
                <span className="badge bg-secondary">
                  <i className="fas fa-clock me-1"></i> {curso?.duracion}
                </span>
              </div>
              <Card.Text>{curso?.descripcion}</Card.Text>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <strong>Instructor:</strong> {curso?.instructor_nombre} {curso?.instructor_apellido}
                </div>
                <div className="fs-4 fw-bold text-primary">${curso?.precio}</div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-6">
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">Completa tu inscripción</Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="fecha_preferida">
                  <Form.Label>Fecha preferida para iniciar</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_preferida"
                    value={formData.fecha_preferida}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="comentarios">
                  <Form.Label>Comentarios o preguntas (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleChange}
                    placeholder="¿Tienes alguna pregunta o requerimiento especial?"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg" disabled={submitting} className="py-3">
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i> Confirmar Inscripción
                      </>
                    )}
                  </Button>
                </div>

                {!isAuthenticated && (
                  <div className="text-center mt-3">
                    <small className="text-muted">Necesitarás iniciar sesión para completar la inscripción.</small>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default InscripcionCurso
