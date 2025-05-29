"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from "react-bootstrap"
import resenaService from "../services/resenaService"
import authService from "../services/authService"

const Resenas = () => {
  const [resenas, setResenas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    calificacion: 5,
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const isAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const data = await resenaService.getAll()
        setResenas(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar reseñas:", error)
        setError("Error al cargar las reseñas. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchResenas()
  }, [])

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
      await resenaService.create(formData)
      setSuccess("¡Reseña enviada con éxito! Será revisada por un administrador antes de ser publicada.")
      setFormData({
        titulo: "",
        contenido: "",
        calificacion: 5,
      })
      setShowForm(false)
    } catch (error) {
      console.error("Error al enviar reseña:", error)
      setError("Error al enviar la reseña. Por favor, intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (calificacion) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<i key={i} className={`fas fa-star ${i <= calificacion ? "text-warning" : "text-muted"}`}></i>)
    }
    return stars
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Experiencias de nuestros clientes</h1>
        {isAuthenticated && (
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Escribir reseña"}
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {showForm && (
        <Card className="mb-5 shadow-sm">
          <Card.Body>
            <Card.Title>Comparte tu experiencia</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="titulo">
                <Form.Label>Título</Form.Label>
                <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contenido">
                <Form.Label>Tu experiencia</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="calificacion">
                <Form.Label>Calificación</Form.Label>
                <Form.Select name="calificacion" value={formData.calificacion} onChange={handleChange}>
                  <option value="5">5 estrellas - Excelente</option>
                  <option value="4">4 estrellas - Muy bueno</option>
                  <option value="3">3 estrellas - Bueno</option>
                  <option value="2">2 estrellas - Regular</option>
                  <option value="1">1 estrella - Malo</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar reseña"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {!isAuthenticated && (
        <Alert variant="info" className="mb-4">
          <i className="fas fa-info-circle me-2"></i> Para dejar una reseña, por favor{" "}
          <a href="/login">inicia sesión</a> o <a href="/register">regístrate</a>.
        </Alert>
      )}

      <Row>
        {resenas.length > 0 ? (
          resenas.map((resena) => (
            <Col md={4} className="mb-4" key={resena.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="mb-2">{renderStars(resena.calificacion)}</div>
                  <Card.Title>{resena.titulo}</Card.Title>
                  <Card.Text>{resena.contenido}</Card.Text>
                  <Card.Footer className="text-muted">
                    <small>
                      Por {resena.nombre} {resena.apellido} - {new Date(resena.fecha_creacion).toLocaleDateString()}
                    </small>
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No hay reseñas disponibles actualmente.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default Resenas
