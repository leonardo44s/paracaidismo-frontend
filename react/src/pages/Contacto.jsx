"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import contactoService from "../services/contactoService"
import infoService from "../services/infoService"
import '@fortawesome/fontawesome-free/css/all.min.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const [infoContacto, setInfoContacto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await infoService.getInfo("contacto")
        setInfoContacto(JSON.parse(data.contenido))
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar información de contacto:", error)
        setLoading(false)
      }
    }

    fetchInfo()
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
      await contactoService.create(formData)
      setSuccess("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.")
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
      })
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setError("Error al enviar el mensaje. Por favor, intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Contáctanos</h1>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h3 className="mb-4">Envíanos un mensaje</h3>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono (opcional)</Form.Label>
                  <Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="mensaje">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h3 className="mb-4">Información de contacto</h3>

              {!loading && infoContacto ? (
                <div>
                  <p className="mb-3">
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i> <strong>Dirección:</strong>{" "}
                    {infoContacto.direccion}
                  </p>
                  <p className="mb-3">
                    <i className="fas fa-phone me-2 text-primary"></i> <strong>Teléfono:</strong>{" "}
                    {infoContacto.telefono}
                  </p>
                  <p className="mb-3">
                    <i className="fas fa-envelope me-2 text-primary"></i> <strong>Email:</strong> {infoContacto.email}
                  </p>
                  <p className="mb-3">
                    <i className="fas fa-clock me-2 text-primary"></i> <strong>Horario:</strong> {infoContacto.horario}
                  </p>
                </div>
              ) : (
                <p>Cargando información de contacto...</p>
              )}

              <div className="mt-4">
                <h4 className="mb-3">Síguenos en redes sociales</h4>
                <div className="d-flex gap-3">
                  <a href="#" className="text-primary fs-4">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="text-primary fs-4">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-primary fs-4">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-primary fs-4">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Contacto
