"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Spinner, Modal, Form } from "react-bootstrap"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import eventoService from "../services/eventoService"
import authService from "../services/authService"
import inscripcionService from "../services/inscripcionService"
import "../styles/evento-detail.css"
import '@fortawesome/fontawesome-free/css/all.min.css';

const EventoDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [evento, setEvento] = useState(null)
  const [inscripciones, setInscripciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inscribiendoId, setInscribiendoId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedInscripcion, setSelectedInscripcion] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState("")
  const [inscripcionExitosa, setInscripcionExitosa] = useState(false)

  const isAuthenticated = authService.isAuthenticated()
  const currentUser = authService.getCurrentUser()
  const isAdmin = isAuthenticated && currentUser?.rol === "admin"
  const isInstructor = isAuthenticated && currentUser?.rol === "instructor"

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true)
        console.log("Cargando detalles del evento para el ID:", id)

        const data = await eventoService.getById(id)
        console.log("Datos del evento recibidos:", data)
        setEvento(data)

        // Si es admin o instructor, cargar las inscripciones
        if (isAdmin || (isInstructor && data.instructor_id === currentUser?.id)) {
          const inscripcionesData = await inscripcionService.getByEvento(id)
          console.log("Inscripciones del evento:", inscripcionesData)
          setInscripciones(inscripcionesData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar evento:", error)
        setError("Error al cargar los detalles del evento. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchEvento()
  }, [id])
  
  const handleInscripcion = async () => {
    if (!isAuthenticated) {
      // Guardar la URL actual para redirigir después del login
      localStorage.setItem("redirectAfterLogin", `/eventos/${id}`);
      navigate("/login");
      return;
    }
  
    setInscribiendoId(id);
  
    try {
      await inscripcionService.inscribirEvento(id);
      setInscripcionExitosa(true);
      setTimeout(() => {
        setInscripcionExitosa(false);
        // Redirigir a mis inscripciones después de 2 segundos
        navigate("/mis-inscripciones");
      }, 2000);
    } catch (error) {
      console.error("Error al inscribirse:", error);
  
      // Manejar el mensaje de error específico del backend
      if (error.response && error.response.status === 400 && error.response.data?.message) {
        if (error.response.data.message === "Ya estás inscrito en este evento") {
          alert("Ya estás inscrito en este evento. No puedes inscribirte nuevamente.");
        } else {
          alert(error.response.data.message); // Mostrar otros mensajes del backend
        }
      } else {
        // Mostrar un mensaje genérico si no hay un mensaje específico
        alert("Error al realizar la inscripción. Por favor, intenta de nuevo.");
      }
    } finally {
      setInscribiendoId(null);
    }
  };
  

  const handleOpenModal = (inscripcion) => {
    setSelectedInscripcion(inscripcion)
    setNuevoEstado(inscripcion.estado)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedInscripcion(null)
  }

  const handleUpdateEstado = async () => {
    try {
      await inscripcionService.updateEstado(selectedInscripcion.id, nuevoEstado)

      // Actualizar la lista de inscripciones
      const inscripcionesData = await inscripcionService.getByEvento(id)
      setInscripciones(inscripcionesData)

      handleCloseModal()
      alert("Estado actualizado con éxito")
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      alert("Error al actualizar el estado. Por favor, intenta de nuevo.")
    }
  }

  const handleEliminarEvento = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.")) {
      try {
        await eventoService.delete(id)
        alert("Evento eliminado con éxito")
        navigate("/eventos")
      } catch (error) {
        console.error("Error al eliminar evento:", error)
        alert("Error al eliminar el evento. Por favor, intenta de nuevo.")
      }
    }
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "aprobada":
        return "success"
      case "rechazada":
        return "danger"
      case "completada":
        return "primary"
      case "cancelada":
        return "secondary"
      default:
        return "warning"
    }
  }

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" className="spinner-large" />
          <p className="mt-3 loading-text">Cargando detalles del evento...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      </Container>
    )
  }

  if (!evento) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Evento no encontrado
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5 evento-detail-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Row>
          <Col lg={8}>
            <Card className="evento-detail-card mb-4">
              <Card.Body className="p-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="evento-header">
                    <div className="evento-title-container">
                      <h1 className="evento-title">{evento.titulo}</h1>
                      <Badge bg="primary" className="evento-badge">
                        {new Date(evento.fecha).toLocaleDateString()} - {evento.hora}
                      </Badge>
                    </div>
                    <div className="evento-image">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evento"
                        className="rounded-circle shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="evento-info">
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{evento.lugar}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-user-tie"></i>
                      <span>
                        Instructor: {evento.instructor_nombre} {evento.instructor_apellido}
                      </span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <span>Capacidad: {evento.capacidad} personas</span>
                    </div>
                  </div>

                  <div className="evento-description">
                    <h4 className="section-title">Descripción</h4>
                    <p>{evento.descripcion || "Este evento no tiene una descripción detallada."}</p>
                  </div>

                  {inscripcionExitosa && (
                    <Alert variant="success" className="mt-4 inscripcion-alert">
                      <div className="d-flex align-items-center">
                        <div className="success-icon me-3">
                          <i className="fas fa-check-circle fa-2x"></i>
                        </div>
                        <div>
                          <h5 className="alert-heading mb-1">¡Inscripción Exitosa!</h5>
                          <p className="mb-0">
                            Tu inscripción ha sido procesada correctamente. Te redirigiremos a tus inscripciones en unos
                            momentos.
                          </p>
                        </div>
                      </div>
                    </Alert>
                  )}

                  <div className="evento-actions">
                    {isAuthenticated && !isAdmin && !isInstructor && (
                      <Button
                        variant="success"
                        onClick={handleInscripcion}
                        disabled={inscribiendoId === id}
                        className="inscripcion-button"
                      >
                        {inscribiendoId === id ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Inscribiendo...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-2"></i>
                            Inscribirse en este Evento
                          </>
                        )}
                      </Button>
                    )}

                    {(isAdmin || (isInstructor && evento.instructor_id === currentUser.id)) && (
                      <div className="admin-actions">
                        <Button variant="primary" onClick={() => navigate(`/eventos/editar/${id}`)} className="me-2">
                          <i className="fas fa-edit me-1"></i> Editar Evento
                        </Button>
                        <Button variant="danger" onClick={handleEliminarEvento}>
                          <i className="fas fa-trash me-1"></i> Eliminar Evento
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Card.Body>
            </Card>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="evento-detail-card mb-4">
                <Card.Body>
                  <h4 className="section-title">¿Qué incluye este evento?</h4>
                  <div className="incluye-grid">
                    <div className="incluye-item">
                      <div className="incluye-icon">
                        <i className="fas fa-parachute-box"></i>
                      </div>
                      <div className="incluye-content">
                        <h5>Equipo Completo</h5>
                        <p>Todo el equipo necesario para el salto</p>
                      </div>
                    </div>
                    <div className="incluye-item">
                      <div className="incluye-icon">
                        <i className="fas fa-chalkboard-teacher"></i>
                      </div>
                      <div className="incluye-content">
                        <h5>Instrucción</h5>
                        <p>Capacitación previa al salto</p>
                      </div>
                    </div>
                    <div className="incluye-item">
                      <div className="incluye-icon">
                        <i className="fas fa-plane"></i>
                      </div>
                      <div className="incluye-content">
                        <h5>Vuelo</h5>
                        <p>Transporte aéreo hasta la altura de salto</p>
                      </div>
                    </div>
                    <div className="incluye-item">
                      <div className="incluye-icon">
                        <i className="fas fa-certificate"></i>
                      </div>
                      <div className="incluye-content">
                        <h5>Certificado</h5>
                        <p>Certificado de participación</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="evento-detail-card">
                <Card.Body>
                  <h4 className="section-title">Información Importante</h4>
                  <div className="info-importante">
                    <div className="info-importante-item">
                      <h5>
                        <i className="fas fa-clock me-2"></i> Horario
                      </h5>
                      <p>Por favor, preséntate 1 hora antes del evento para la preparación y briefing de seguridad.</p>
                    </div>
                    <div className="info-importante-item">
                      <h5>
                        <i className="fas fa-tshirt me-2"></i> Vestimenta
                      </h5>
                      <p>Usa ropa cómoda y zapatillas deportivas. Te proporcionaremos el traje de salto.</p>
                    </div>
                    <div className="info-importante-item">
                      <h5>
                        <i className="fas fa-id-card me-2"></i> Documentación
                      </h5>
                      <p>Trae tu documento de identidad y el comprobante de inscripción.</p>
                    </div>
                    <div className="info-importante-item">
                      <h5>
                        <i className="fas fa-cloud-sun me-2"></i> Clima
                      </h5>
                      <p>El evento puede ser reprogramado en caso de condiciones climáticas adversas.</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={4}>
            {(isAdmin || (isInstructor && evento.instructor_id === currentUser?.id)) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="evento-detail-card inscripciones-card mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Inscripciones</h5>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {inscripciones.length > 0 ? (
                      inscripciones.map((inscripcion) => (
                        <ListGroup.Item key={inscripcion.id} className="inscripcion-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="inscripcion-nombre">
                                {inscripcion.usuario_nombre} {inscripcion.usuario_apellido}
                              </div>
                              <small className="text-muted">
                                {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
                              </small>
                            </div>
                            <div>
                              <Badge bg={getEstadoBadge(inscripcion.estado)} className="estado-badge">
                                {inscripcion.estado.charAt(0).toUpperCase() + inscripcion.estado.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="inscripcion-actions mt-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleOpenModal(inscripcion)}
                              className="me-1"
                            >
                              <i className="fas fa-edit me-1"></i> Cambiar Estado
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="text-center py-4">
                        <i className="fas fa-info-circle me-2 text-muted"></i>
                        No hay inscripciones para este evento.
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="evento-detail-card info-card">
                <Card.Body className="p-4">
                  <h4 className="mb-3">Detalles del Evento</h4>
                  <div className="evento-detalles">
                    <div className="detalle-item">
                      <div className="detalle-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="detalle-content">
                        <h6>Fecha</h6>
                        <p>{new Date(evento.fecha).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <div className="detalle-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="detalle-content">
                        <h6>Hora</h6>
                        <p>{evento.hora}</p>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <div className="detalle-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="detalle-content">
                        <h6>Lugar</h6>
                        <p>{evento.lugar}</p>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <div className="detalle-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="detalle-content">
                        <h6>Capacidad</h6>
                        <p>{evento.capacidad} personas</p>
                      </div>
                    </div>
                  </div>

                  {!isAdmin && !isInstructor && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 mt-3"
                      onClick={handleInscripcion}
                      disabled={inscribiendoId === id}
                    >
                      {inscribiendoId === id ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Inscribiendo...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle me-2"></i> Inscribirse
                        </>
                      )}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Card className="evento-detail-card mt-4">
                <Card.Body className="p-4">
                  <h4 className="mb-3">¿Necesitas más información?</h4>
                  <p>Si tienes dudas sobre este evento, no dudes en contactarnos.</p>
                  <Link to="/contacto" className="btn btn-outline-primary w-100">
                    <i className="fas fa-envelope me-2"></i> Contactar
                  </Link>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      {/* Modal para cambiar estado de inscripción */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Estado de Inscripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInscripcion && (
            <>
              <p>
                <strong>Usuario:</strong> {selectedInscripcion.usuario_nombre} {selectedInscripcion.usuario_apellido}
              </p>
              <p>
                <strong>Fecha de inscripción:</strong>{" "}
                {new Date(selectedInscripcion.fecha_inscripcion).toLocaleDateString()}
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateEstado}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default EventoDetail
