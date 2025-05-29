"use client"

import { useState, useEffect } from "react"
import { Container, Table, Button, Badge, Spinner, Alert, Modal } from "react-bootstrap"
import contactoService from "../../services/contactoService"

const GestionContactos = () => {
  const [contactos, setContactos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedContacto, setSelectedContacto] = useState(null)

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const data = await contactoService.getAll()
        setContactos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar mensajes:", error)
        setError("Error al cargar los mensajes de contacto. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchContactos()
  }, [])

  const handleVerMensaje = (contacto) => {
    setSelectedContacto(contacto)
    setShowModal(true)

    // Si el mensaje no está leído, marcarlo como leído
    if (!contacto.leido) {
      handleMarcarLeido(contacto.id)
    }
  }

  const handleMarcarLeido = async (id) => {
    try {
      await contactoService.marcarLeido(id)
      // Actualizar el estado del mensaje en la lista
      setContactos(
        contactos.map((contacto) => {
          if (contacto.id === id) {
            return { ...contacto, leido: 1 }
          }
          return contacto
        }),
      )
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error)
    }
  }

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer.")) {
      try {
        await contactoService.delete(id)
        // Actualizar la lista de mensajes
        setContactos(contactos.filter((contacto) => contacto.id !== id))

        // Si el mensaje eliminado es el que se está mostrando, cerrar el modal
        if (selectedContacto && selectedContacto.id === id) {
          setShowModal(false)
        }

        alert("Mensaje eliminado con éxito")
      } catch (error) {
        console.error("Error al eliminar mensaje:", error)
        alert("Error al eliminar el mensaje. Por favor, intenta de nuevo.")
      }
    }
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
      <h1 className="mb-4">Gestión de Mensajes de Contacto</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {contactos.length > 0 ? (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.id} className={contacto.leido ? "" : "table-warning"}>
                <td>{contacto.nombre}</td>
                <td>{contacto.email}</td>
                <td>{contacto.telefono || "-"}</td>
                <td>{new Date(contacto.fecha_creacion).toLocaleDateString()}</td>
                <td>
                  <Badge bg={contacto.leido ? "success" : "warning"}>{contacto.leido ? "Leído" : "No leído"}</Badge>
                </td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleVerMensaje(contacto)}>
                    <i className="fas fa-eye me-1"></i> Ver
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(contacto.id)}>
                    <i className="fas fa-trash me-1"></i> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No hay mensajes de contacto.</Alert>
      )}

      {/* Modal para ver mensaje completo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Mensaje de {selectedContacto?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContacto && (
            <div>
              <p>
                <strong>Nombre:</strong> {selectedContacto.nombre}
              </p>
              <p>
                <strong>Email:</strong> {selectedContacto.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedContacto.telefono || "-"}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(selectedContacto.fecha_creacion).toLocaleString()}
              </p>
              <hr />
              <h5>Mensaje:</h5>
              <p>{selectedContacto.mensaje}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={() => handleEliminar(selectedContacto.id)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default GestionContactos
