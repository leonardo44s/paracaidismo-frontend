"use client"

import { useState, useEffect } from "react"
import { Container, Table, Button, Alert, Modal, Form } from "react-bootstrap"
import userService from "../../services/userService"

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll()
        setUsers(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
        setError("Error al cargar la lista de usuarios. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleOpenModal = (user) => {
    setCurrentUser(user)
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentUser(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await userService.update(currentUser.id, formData)

      // Actualizar la lista de usuarios
      const updatedUsers = users.map((user) => {
        if (user.id === currentUser.id) {
          return { ...user, ...formData }
        }
        return user
      })

      setUsers(updatedUsers)
      handleCloseModal()
      alert("Usuario actualizado con éxito")
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      alert("Error al actualizar el usuario. Por favor, intenta de nuevo.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
      try {
        await userService.delete(id)

        // Actualizar la lista de usuarios
        setUsers(users.filter((user) => user.id !== id))

        alert("Usuario eliminado con éxito")
      } catch (error) {
        console.error("Error al eliminar usuario:", error)
        alert("Error al eliminar el usuario. Por favor, intenta de nuevo.")
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
      <h1 className="mb-4">Gestión de Usuarios</h1>

      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => handleOpenModal(user)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para editar usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={formData.rol} onChange={handleChange} required>
                <option value="usuario">Usuario</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default UsersList
