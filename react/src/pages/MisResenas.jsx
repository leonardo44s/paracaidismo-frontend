"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from "react-bootstrap"
import { FaStar, FaTrash } from "react-icons/fa"
import resenaService from "../services/resenaService"
import { toast } from "react-toastify"
import "../styles/mis-resenas.css"

const MisResenas = () => {
  const [resenas, setResenas] = useState([])
  const [cursosDisponibles, setCursosDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [resenaToDelete, setResenaToDelete] = useState(null)

  // Estado para el formulario de reseña
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    calificacion: 5,
    curso_id: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resenasData, cursosData] = await Promise.all([
        resenaService.getMisResenas(),
        resenaService.getCursosDisponibles(),
      ])

      setResenas(resenasData)
      setCursosDisponibles(cursosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar tus reseñas")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "calificacion" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      toast.error("Por favor completa todos los campos")
      return
    }

    try {
      await resenaService.createResena(formData)
      toast.success("Reseña enviada exitosamente. Será revisada por un administrador.")
      setShowModal(false)

      // Limpiar formulario
      setFormData({
        titulo: "",
        contenido: "",
        calificacion: 5,
        curso_id: "",
      })

      // Recargar datos
      fetchData()
    } catch (error) {
      console.error("Error al enviar reseña:", error)
      toast.error("Error al enviar reseña")
    }
  }

  const confirmDelete = (resena) => {
    setResenaToDelete(resena)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    try {
      await resenaService.deleteResena(resenaToDelete.id)
      toast.success("Reseña eliminada exitosamente")
      setResenas(resenas.filter((r) => r.id !== resenaToDelete.id))
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Error al eliminar reseña:", error)
      toast.error("Error al eliminar reseña")
    }
  }

  const renderStars = (calificacion) => {
    return [...Array(5)].map((_, i) => <FaStar key={i} className={i < calificacion ? "text-warning" : "text-muted"} />)
  }

  const getStatusBadge = (estado) => {
    switch (estado) {
      case "aprobada":
        return <Badge bg="success">Aprobada</Badge>
      case "pendiente":
        return <Badge bg="warning">Pendiente</Badge>
      case "rechazada":
        return <Badge bg="danger">Rechazada</Badge>
      default:
        return <Badge bg="secondary">Desconocido</Badge>
    }
  }

  if (loading) {
    return (
      <Container className="my-4">
        <h2>Mis Reseñas</h2>
        <p>Cargando tus reseñas...</p>
      </Container>
    )
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Reseñas</h2>
        <Button variant="primary" onClick={() => setShowModal(true)} disabled={cursosDisponibles.length === 0}>
          Escribir Reseña
        </Button>
      </div>

      {resenas.length === 0 ? (
        <div className="text-center my-5">
          <h4>No has escrito ninguna reseña todavía</h4>
          <p>¡Comparte tu experiencia con otros usuarios!</p>
        </div>
      ) : (
        <Row>
          {resenas.map((resena) => (
            <Col md={6} lg={4} key={resena.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>{getStatusBadge(resena.estado)}</div>
                  <div>{renderStars(resena.calificacion)}</div>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{resena.titulo}</Card.Title>
                  {resena.curso_nombre && (
                    <Card.Subtitle className="mb-2 text-muted">Curso: {resena.curso_nombre}</Card.Subtitle>
                  )}
                  <Card.Text>{resena.contenido}</Card.Text>
                  <div className="text-muted small">Fecha: {new Date(resena.fecha_creacion).toLocaleDateString()}</div>

                  {resena.estado === "rechazada" && resena.motivo_rechazo && (
                    <div className="mt-2 p-2 bg-light border rounded">
                      <strong>Motivo de rechazo:</strong> {resena.motivo_rechazo}
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="text-end">
                  <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(resena)}>
                    <FaTrash /> Eliminar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal para crear reseña */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Escribir Reseña</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {cursosDisponibles.length === 0 ? (
              <div className="text-center my-3">
                <p>No tienes cursos disponibles para reseñar.</p>
                <p>Debes completar un curso para poder escribir una reseña.</p>
              </div>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Curso</Form.Label>
                  <Form.Select name="curso_id" value={formData.curso_id} onChange={handleInputChange} required>
                    <option value="">Selecciona un curso...</option>
                    {cursosDisponibles.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Título de tu reseña"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Calificación</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Range
                      name="calificacion"
                      min="1"
                      max="5"
                      step="1"
                      value={formData.calificacion}
                      onChange={handleInputChange}
                      className="me-2"
                    />
                    <div className="stars-display">{renderStars(formData.calificacion)}</div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleInputChange}
                    placeholder="Comparte tu experiencia..."
                    required
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={cursosDisponibles.length === 0}>
              Enviar Reseña
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar esta reseña?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default MisResenas
