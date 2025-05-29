"use client"

import { useState, useEffect } from "react"
import { Container, Button, Alert, Badge, Spinner, Card, Tabs, Tab, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import inscripcionService from "../services/inscripcionService"
import "../styles/mis-inscripciones.css"

const MisInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelando, setCancelando] = useState(null)
  const [activeTab, setActiveTab] = useState("todas")
  const [showDetails, setShowDetails] = useState(null)

  // Cargar las inscripciones del usuario
  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        setLoading(true)
        const data = await inscripcionService.getMisInscripciones()
        setInscripciones(data)
      } catch (error) {
        console.error("Error al cargar inscripciones:", error)
        setError("Error al cargar tus inscripciones. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchInscripciones()
  }, [])

  // Manejar la cancelación de una inscripción
  const handleCancelar = async (id, tipo) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta inscripción?")) {
      setCancelando(id);
  
      try {
        // Llamar al servicio con el tipo de inscripción
        await inscripcionService.cancelar(id, tipo);
  
        // Actualizar la lista de inscripciones en el estado
        setInscripciones((prevInscripciones) =>
          prevInscripciones.map((inscripcion) =>
            inscripcion.id === id && inscripcion.tipo === tipo
              ? { ...inscripcion, estado: "cancelada" }
              : inscripcion
          )
        );
  
        alert("Inscripción cancelada con éxito");
      } catch (error) {
        console.error("Error al cancelar inscripción:", error);
        alert("Error al cancelar la inscripción. Por favor, intenta de nuevo.");
      } finally {
        setCancelando(null);
      }
    }
  }

  // Obtener el estilo del badge según el estado
  const getBadgeVariant = (estado) => {
    switch (estado.toLowerCase()) {
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

  // Obtener el texto del estado
  const getEstadoText = (estado) => {
    switch (estado.toLowerCase()) {
      case "aprobada":
        return "Aprobada"
      case "rechazada":
        return "Rechazada"
      case "completada":
        return "Completada"
      case "cancelada":
        return "Cancelada"
      default:
        return "Pendiente"
    }
  }

  // Alternar la visualización de los detalles
  const toggleDetails = (id) => {
    setShowDetails((prev) => (prev === id ? null : id))
  }

  // Filtrar las inscripciones según la pestaña activa
  const filteredInscripciones =
    activeTab === "todas"
      ? inscripciones
      : activeTab === "eventos"
      ? inscripciones.filter((i) => i.tipo === "evento")
      : inscripciones.filter((i) => i.tipo === "curso")

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" className="spinner-large" />
          <p className="mt-3 loading-text">Cargando tus inscripciones...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5 inscripciones-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold text-gradient">Mis Inscripciones</h1>
        <p className="lead">Gestiona tus inscripciones a eventos y cursos</p>
      </motion.div>

      {error ? (
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      ) : inscripciones.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="inscripciones-card">
            <Card.Header className="inscripciones-header">
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="inscripciones-tabs">
                <Tab
                  eventKey="todas"
                  title={
                    <span>
                      <i className="fas fa-list me-2"></i>Todas
                    </span>
                  }
                />
                <Tab
                  eventKey="eventos"
                  title={
                    <span>
                      <i className="fas fa-calendar-alt me-2"></i>Eventos
                    </span>
                  }
                />
                <Tab
                  eventKey="cursos"
                  title={
                    <span>
                      <i className="fas fa-graduation-cap me-2"></i>Cursos
                    </span>
                  }
                />
              </Tabs>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredInscripciones.length > 0 ? (
                <div className="inscripciones-list">
                  {filteredInscripciones.map((inscripcion) => (
                    <motion.div
                      key={`${inscripcion.tipo}-${inscripcion.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inscripcion-item"
                    >
                      <div className="inscripcion-header" onClick={() => toggleDetails(inscripcion.id)}>
                        <div className="inscripcion-tipo">
                          <Badge bg={inscripcion.tipo === "evento" ? "info" : "primary"} className="tipo-badge">
                            {inscripcion.tipo === "evento" ? "Evento" : "Curso"}
                          </Badge>
                        </div>
                        <div className="inscripcion-titulo">
                          <h5>{inscripcion.titulo}</h5>
                          <div className="inscripcion-fecha">
                            {inscripcion.tipo === "evento"
                              ? `${new Date(inscripcion.fecha_evento).toLocaleDateString()} - ${inscripcion.hora}`
                              : inscripcion.fecha_preferida
                              ? `Fecha preferida: ${new Date(inscripcion.fecha_preferida).toLocaleDateString()}`
                              : "Fecha por confirmar"}
                          </div>
                        </div>
                        <div className="inscripcion-estado">
                          <Badge bg={getBadgeVariant(inscripcion.estado)} className="estado-badge">
                            {getEstadoText(inscripcion.estado)}
                          </Badge>
                        </div>
                        <div className="inscripcion-toggle">
                          <i className={`fas fa-chevron-${showDetails === inscripcion.id ? "up" : "down"}`}></i>
                        </div>
                      </div>

                      {showDetails === inscripcion.id && (
                        <div className="inscripcion-details">
                          <Row>
                            <Col md={6}>
                              <div className="detail-group">
                                <div className="detail-label">Fecha de inscripción:</div>
                                <div className="detail-value">
                                  {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
                                </div>
                              </div>
                              {inscripcion.tipo === "curso" && inscripcion.comentarios && (
                                <div className="detail-group">
                                  <div className="detail-label">Comentarios:</div>
                                  <div className="detail-value">{inscripcion.comentarios}</div>
                                </div>
                              )}
                              {inscripcion.tipo === "evento" && (
                                <div className="detail-group">
                                  <div className="detail-label">Lugar:</div>
                                  <div className="detail-value">{inscripcion.lugar || "Por confirmar"}</div>
                                </div>
                              )}
                            </Col>
                            <Col md={6}>
                              {inscripcion.tipo === "curso" && (
                                <>
                                  <div className="detail-group">
                                    <div className="detail-label">Nivel:</div>
                                    <div className="detail-value">{inscripcion.nivel || "No especificado"}</div>
                                  </div>
                                  <div className="detail-group">
                                    <div className="detail-label">Precio:</div>
                                    <div className="detail-value">${inscripcion.precio || "No especificado"}</div>
                                  </div>
                                </>
                              )}
                            </Col>
                          </Row>
                          <div className="inscripcion-actions">
                            <Link
                              to={`/${inscripcion.tipo}s/${inscripcion.evento_id || inscripcion.curso_id}`}
                              className="btn btn-outline-primary"
                            >
                              <i className="fas fa-eye me-1"></i> Ver Detalles
                            </Link>
                            {inscripcion.estado !== "completada" && inscripcion.estado !== "cancelada" && (
                              <Button
                              variant="outline-danger"
                              onClick={() => handleCancelar(inscripcion.id, inscripcion.tipo)}
                              disabled={cancelando === inscripcion.id}
                            >
                              {cancelando === inscripcion.id ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-1"
                                  />
                                  Cancelando...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-times-circle me-1"></i> Cancelar
                                </>
                              )}
                            </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-info-circle fa-3x text-muted mb-3"></i>
                  <p className="lead">No hay inscripciones en esta categoría</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert variant="info" className="text-center no-inscripciones">
            <i className="fas fa-info-circle fa-3x mb-3"></i>
            <p className="lead">No tienes inscripciones activas.</p>
            <div className="mt-4">
              <Link to="/eventos" className="btn btn-primary me-3">
                <i className="fas fa-calendar-alt me-2"></i> Ver Eventos
              </Link>
              <Link to="/cursos" className="btn btn-outline-primary">
                <i className="fas fa-graduation-cap me-2"></i> Ver Cursos
              </Link>
            </div>
          </Alert>
        </motion.div>
      )}
    </Container>
  )
}

export default MisInscripciones