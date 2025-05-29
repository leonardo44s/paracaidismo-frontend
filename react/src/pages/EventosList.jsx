"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import eventoService from "../services/eventoService"
import authService from "../services/authService"
import inscripcionService from "../services/inscripcionService"
import '@fortawesome/fontawesome-free/css/all.min.css';

const EventosList = () => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inscribiendoId, setInscribiendoId] = useState(null)

  const isAuthenticated = authService.isAuthenticated()
  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true)
        console.log("Obteniendo eventos...")
        const data = await eventoService.getAll()
        console.log("Eventos obtenidos:", data)
        setEventos(data || [])
        setError(null)
      } catch (error) {
        console.error("Error al cargar eventos:", error)
        setError("Error al cargar los eventos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchEventos()
  }, [])

  const handleInscripcion = async (eventoId) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para inscribirte a un evento")
      return
    }

    setInscribiendoId(eventoId)

    try {
      await inscripcionService.inscribirEvento(eventoId)
      alert("¡Inscripción realizada con éxito!")
    } catch (error) {
      console.error("Error al inscribirse:", error)
      alert("Error al realizar la inscripción. Por favor, intenta de nuevo.")
    } finally {
      setInscribiendoId(null)
    }
  }

  return (
    <Container className="py-5 mt-5">
      <h1 className="mb-4">Eventos de Paracaidismo</h1>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando eventos...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt me-2"></i>
              Reintentar
            </Button>
          </div>
        </Alert>
      ) : eventos.length === 0 ? (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          No hay eventos programados actualmente.
        </Alert>
      ) : (
        <Row>
          {eventos.map((evento) => (
            <Col md={6} lg={4} className="mb-4" key={evento.id}>
              <Card className="h-100 shadow-sm evento-card">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-3">{evento.titulo}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    <i className="far fa-calendar-alt me-2"></i>
                    {new Date(evento.fecha).toLocaleDateString()} - {evento.hora}
                  </Card.Subtitle>
                  <Card.Text className="mb-3">
                    {evento.descripcion?.substring(0, 100)}
                    {evento.descripcion?.length > 100 ? "..." : ""}
                  </Card.Text>
                  <div className="mb-3">
                    <strong>
                      <i className="fas fa-map-marker-alt me-2"></i>Lugar:
                    </strong>{" "}
                    {evento.lugar}
                  </div>
                  <div className="mb-3">
                    <strong>
                      <i className="fas fa-user me-2"></i>Instructor:
                    </strong>{" "}
                    {evento.instructor_nombre} {evento.instructor_apellido}
                  </div>
                  <Badge bg="info" className="align-self-start mb-3">
                    <i className="fas fa-users me-1"></i> Capacidad: {evento.capacidad} personas
                  </Badge>

                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/eventos/${evento.id}`} className="btn btn-outline-primary flex-grow-1">
                      <i className="fas fa-info-circle me-1"></i> Ver Detalles
                    </Link>

                    {isAuthenticated && currentUser?.rol !== "admin" && currentUser?.rol !== "instructor" && (
                      
                      <Button
                        variant="success"
                        className="flex-grow-1"
                        onClick={() => handleInscripcion(evento.id)}
                        disabled={inscribiendoId === evento.id}
                      >
                        {inscribiendoId === evento.id ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                            Inscribiendo...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-1"></i> Inscribirse
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default EventosList
