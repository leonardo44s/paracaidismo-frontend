"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from "react-bootstrap"
import { FaCheck, FaTimes, FaStar } from "react-icons/fa"
import resenaService from "../../services/resenaService"
import { toast } from "react-toastify"
import "../../styles/admin.css"

const GestionResenas = () => {
  const [resenasPendientes, setResenasPendientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentResena, setCurrentResena] = useState(null)
  const [motivoRechazo, setMotivoRechazo] = useState("")

  useEffect(() => {
    fetchResenas()
  }, [])

  const fetchResenas = async () => {
    try {
      setLoading(true)
      const data = await resenaService.getResenasPendientes()
      setResenasPendientes(data)
    } catch (error) {
      console.error("Error al cargar reseñas pendientes:", error)
      toast.error("Error al cargar reseñas pendientes")
    } finally {
      setLoading(false)
    }
  }

  const handleAprobar = async (id) => {
    try {
      await resenaService.aprobarResena(id)
      toast.success("Reseña aprobada exitosamente")
      setResenasPendientes(resenasPendientes.filter((resena) => resena.id !== id))
    } catch (error) {
      console.error("Error al aprobar reseña:", error)
      toast.error("Error al aprobar reseña")
    }
  }

  const openRechazarModal = (resena) => {
    setCurrentResena(resena)
    setMotivoRechazo("")
    setShowModal(true)
  }

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      toast.error("Debes proporcionar un motivo de rechazo")
      return
    }

    try {
      await resenaService.rechazarResena(currentResena.id, motivoRechazo)
      toast.success("Reseña rechazada exitosamente")
      setResenasPendientes(resenasPendientes.filter((resena) => resena.id !== currentResena.id))
      setShowModal(false)
    } catch (error) {
      console.error("Error al rechazar reseña:", error)
      toast.error("Error al rechazar reseña")
    }
  }

  const renderStars = (calificacion) => {
    return [...Array(5)].map((_, i) => <FaStar key={i} className={i < calificacion ? "text-warning" : "text-muted"} />)
  }

  if (loading) {
    return (
      <Container className="my-4">
        <h2>Gestión de Reseñas</h2>
        <p>Cargando reseñas pendientes...</p>
      </Container>
    )
  }

  return (
    <Container className="my-4">
      <h2>Gestión de Reseñas</h2>
      <p>Reseñas pendientes de aprobación: {resenasPendientes.length}</p>

      {resenasPendientes.length === 0 ? (
        <div className="text-center my-5">
          <h4>No hay reseñas pendientes de aprobación</h4>
        </div>
      ) : (
        <Row>
          {resenasPendientes.map((resena) => (
            <Col md={6} lg={4} key={resena.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <Badge bg="warning">Pendiente</Badge>
                  </div>
                  <div>{renderStars(resena.calificacion)}</div>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{resena.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {resena.nombre} {resena.apellido}
                  </Card.Subtitle>
                  {resena.curso_nombre && (
                    <Card.Subtitle className="mb-2 text-muted">Curso: {resena.curso_nombre}</Card.Subtitle>
                  )}
                  <Card.Text>{resena.contenido}</Card.Text>
                  <div className="text-muted small">Fecha: {new Date(resena.fecha_creacion).toLocaleDateString()}</div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button variant="success" size="sm" onClick={() => handleAprobar(resena.id)}>
                    <FaCheck /> Aprobar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => openRechazarModal(resena)}>
                    <FaTimes /> Rechazar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de rechazo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rechazar Reseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Por favor, indica el motivo por el cual estás rechazando esta reseña:</p>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Escribe el motivo del rechazo..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRechazar}>
            Confirmar Rechazo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default GestionResenas
