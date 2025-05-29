"use client"

import { useState, useEffect } from "react"
import { Container, Table, Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import eventoService from "../../services/eventoService"
import authService from "../../services/authService"

const MisEventos = () => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // Si es instructor, obtener solo sus eventos
        const data = await eventoService.getByInstructor(currentUser.id)
        setEventos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar eventos:", error)
        setError("Error al cargar tus eventos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchEventos()
  }, [currentUser.id])

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.")) {
      try {
        await eventoService.delete(id)

        // Actualizar la lista de eventos
        setEventos(eventos.filter((evento) => evento.id !== id))

        alert("Evento eliminado con éxito")
      } catch (error) {
        console.error("Error al eliminar evento:", error)
        alert("Error al eliminar el evento. Por favor, intenta de nuevo.")
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Eventos</h1>
        <Link to="/eventos/nuevo" className="btn btn-primary">
          Crear Nuevo Evento
        </Link>
      </div>

      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : eventos.length > 0 ? (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Lugar</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.titulo}</td>
                <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                <td>{evento.hora}</td>
                <td>{evento.lugar}</td>
                <td>{evento.capacidad}</td>
                <td>
                  <Link to={`/eventos/${evento.id}`} className="btn btn-info btn-sm me-2">
                    Ver
                  </Link>
                  <Link to={`/eventos/editar/${evento.id}`} className="btn btn-primary btn-sm me-2">
                    Editar
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(evento.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No tienes eventos creados. ¡Crea tu primer evento!</Alert>
      )}
    </Container>
  )
}

export default MisEventos
