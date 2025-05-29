"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tab, Tabs } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import userService from "../services/userService"
import authService from "../services/authService"
import "../styles/perfil.css"

const Perfil = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)

  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState("perfil")

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      navigate("/login")
      return
    }

    setCurrentUser(user)

    const fetchUserData = async () => {
      try {
        setLoading(true)
        console.log("Obteniendo datos del usuario con ID:", user.id)
        const data = await userService.getById(user.id)
        console.log("Datos del usuario obtenidos:", data)

        setUserData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
        })

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error)
        setError("Error al cargar tus datos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("Actualizando perfil con datos:", userData)
      await userService.update(currentUser.id, userData)

      // Actualizar datos en localStorage
      const updatedUser = {
        ...currentUser,
        nombre: userData.nombre,
        apellido: userData.apellido,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)

      setSuccess("Perfil actualizado con éxito")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      setError("Error al actualizar el perfil. Por favor, intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      setChangingPassword(false)
      return
    }

    try {
      console.log("Cambiando contraseña para usuario ID:", currentUser.id)
      await userService.updatePassword(currentUser.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setPasswordSuccess("Contraseña actualizada con éxito")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setPasswordSuccess(null), 3000)
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      setPasswordError("Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.")
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos del perfil...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5 perfil-container">
      <Row>
        <Col lg={3}>
          <Card className="profile-sidebar mb-4">
            <Card.Body className="text-center">
              <div className="profile-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <h4 className="mt-3">
                {userData.nombre} {userData.apellido}
              </h4>
              <p className="text-muted">{currentUser?.rol}</p>
              <hr />
              <div className="profile-menu">
                <Button
                  variant={activeTab === "perfil" ? "primary" : "light"}
                  className="w-100 mb-2 text-start"
                  onClick={() => setActiveTab("perfil")}
                >
                  <i className="fas fa-user me-2"></i> Información Personal
                </Button>
                <Button
                  variant={activeTab === "password" ? "primary" : "light"}
                  className="w-100 mb-2 text-start"
                  onClick={() => setActiveTab("password")}
                >
                  <i className="fas fa-key me-2"></i> Cambiar Contraseña
                </Button>
                <Link to="/mis-resenas" className="btn btn-light w-100 mb-2 text-start">
                  <i className="fas fa-star me-2"></i> Mis Reseñas
                </Link>
                <Link to="/mis-inscripciones" className="btn btn-light w-100 mb-2 text-start">
                  <i className="fas fa-clipboard-list me-2"></i> Mis Inscripciones
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="profile-content">
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 profile-tabs">
                <Tab eventKey="perfil" title="Información Personal">
                  {error && (
                    <Alert variant="danger">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="success">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                    </Alert>
                  )}

                  <Form onSubmit={handleProfileSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="nombre">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={userData.nombre}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="apellido">
                          <Form.Label>Apellido</Form.Label>
                          <Form.Control
                            type="text"
                            name="apellido"
                            value={userData.apellido}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleProfileChange}
                        required
                        disabled
                      />
                      <Form.Text className="text-muted">El correo electrónico no se puede cambiar.</Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="password" title="Cambiar Contraseña">
                  {passwordError && (
                    <Alert variant="danger">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {passwordError}
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert variant="success">
                      <i className="fas fa-check-circle me-2"></i>
                      {passwordSuccess}
                    </Alert>
                  )}

                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3" controlId="currentPassword">
                      <Form.Label>Contraseña Actual</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                      <Form.Text className="text-muted">La contraseña debe tener al menos 6 caracteres.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button variant="primary" type="submit" disabled={changingPassword}>
                        {changingPassword ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Cambiando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-key me-2"></i>
                            Cambiar Contraseña
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Perfil
