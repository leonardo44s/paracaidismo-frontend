"use client"

import { useState, useEffect } from "react"
import { Container, Table, Button, Alert, Spinner, Badge, Card, Row, Col, Form, InputGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import eventoService from "../../services/eventoService"
import "../../styles/admin.css"

const GestionEventos = () => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true)
        const data = await eventoService.getAll()
        setEventos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar eventos:", error)
        setError("Error al cargar los eventos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchEventos()
  }, [])

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.")) {
      try {
        await eventoService.delete(id)
        setEventos(eventos.filter((evento) => evento.id !== id))
        alert("Evento eliminado con éxito")
      } catch (error) {
        console.error("Error al eliminar evento:", error)
        alert("Error al eliminar el evento. Por favor, intenta de nuevo.")
      }
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value)
  }

  // Filtrar eventos
  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch =
      evento.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus ? evento.estado === filterStatus : true

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando eventos...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5 admin-container">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Gestión de Eventos</h3>
          <Link to="/eventos/nuevo" className="btn btn-light">
            <i className="fas fa-plus-circle me-2"></i> Nuevo Evento
          </Link>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar por título, descripción o ubicación..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select value={filterStatus} onChange={handleStatusChange}>
                <option value="">Todos los estados</option>
                <option value="programado">Programado</option>
                <option value="en_curso">En curso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Col>
          </Row>

          {filteredEventos.length > 0 ? (
            <Table responsive striped hover className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEventos.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.titulo}</td>
                    <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                    <td>{evento.ubicacion}</td>
                    <td>
                      {evento.inscritos || 0}/{evento.capacidad}
                    </td>
                    <td>
                      <Badge
                        bg={
                          evento.estado === "programado"
                            ? "primary"
                            : evento.estado === "en_curso"
                              ? "warning"
                              : evento.estado === "completado"
                                ? "success"
                                : "danger"
                        }
                      >
                        {evento.estado?.charAt(0).toUpperCase() + evento.estado?.slice(1).replace("_", " ")}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/eventos/${evento.id}`} className="btn btn-sm btn-info">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to={`/eventos/editar/${evento.id}`} className="btn btn-sm btn-primary">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleEliminar(evento.id)}>
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              <i className="fas fa-info-circle me-2"></i>
              No se encontraron eventos con los criterios de búsqueda.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default GestionEventos
