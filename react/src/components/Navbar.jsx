"use client"

import { useState, useEffect } from "react"
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import authService from "../services/authService"
import "../styles/navbar.css"
import '@fortawesome/fontawesome-free/css/all.min.css';

const MainNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
  }, [location])

  const handleLogout = () => {
    authService.logout()
    setCurrentUser(null)
    setShowOffcanvas(false)
    navigate("/login")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleCloseOffcanvas = () => setShowOffcanvas(false)
  const handleShowOffcanvas = () => setShowOffcanvas(true)

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className={`main-navbar ${scrolled ? "scrolled" : ""}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="fas fa-parachute-box brand-icon"></i>
          <span className="brand-text">Club de Paracaidismo</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={`nav-link-animated ${isActive("/") ? "active" : ""}`}>
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/eventos" className={`nav-link-animated ${isActive("/eventos") ? "active" : ""}`}>
              Eventos
            </Nav.Link>
            <Nav.Link as={Link} to="/cursos" className={`nav-link-animated ${isActive("/cursos") ? "active" : ""}`}>
              Cursos
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/quiero-saltar"
              className={`nav-link-animated ${isActive("/quiero-saltar") ? "active" : ""}`}
            >
              Quiero Saltar
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/profesional"
              className={`nav-link-animated ${isActive("/profesional") ? "active" : ""}`}
            >
              Profesional
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto" className={`nav-link-animated ${isActive("/contacto") ? "active" : ""}`}>
              Contacto
            </Nav.Link>
          </Nav>

          <Nav>
            {currentUser ? (
              <Button variant="outline-light" className="user-menu-button" onClick={handleShowOffcanvas}>
                <i className="fas fa-user-circle me-2"></i>
                {currentUser.nombre}
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn-login">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn-register">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Offcanvas para menú de usuario */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end" className="user-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mi Cuenta</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {currentUser && (
            <>
              <div className="user-profile-header">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-info">
                  <h4>
                    {currentUser.nombre} {currentUser.apellido}
                  </h4>
                  <span className="user-role">{currentUser.rol}</span>
                  <p className="user-email">{currentUser.email}</p>
                </div>
              </div>

              <div className="user-menu">
                <Link to="/perfil" className="user-menu-item" onClick={handleCloseOffcanvas}>
                  <i className="fas fa-user me-2"></i> Ver Perfil
                </Link>
                <Link to="/mis-inscripciones" className="user-menu-item" onClick={handleCloseOffcanvas}>
                  <i className="fas fa-clipboard-list me-2"></i> Mis Inscripciones
                </Link>
                <Link to="/mis-resenas" className="user-menu-item" onClick={handleCloseOffcanvas}>
                  <i className="fas fa-star me-2"></i> Mis Reseñas
                </Link>

                {/* Sección para instructores */}
                {(currentUser.rol === "instructor" || currentUser.rol === "admin") && (
                  <>
                    <hr />
                    <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">Instructor</h6>
                    <Link to="/mis-eventos" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-calendar-alt me-2"></i> Mis Eventos
                    </Link>
                    <Link to="/eventos/nuevo" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-plus-circle me-2"></i> Crear Evento
                    </Link>
                  </>
                )}

                {/* Sección para administradores */}
                {currentUser.rol === "admin" && (
                  <>
                    <hr />
                    <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">Administración</h6>
                    <Link to="/admin/usuarios" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-users-cog me-2"></i> Gestionar Usuarios
                    </Link>
                    <Link to="/admin/resenas" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-comment-dots me-2"></i> Gestionar Reseñas
                    </Link>
                    <Link to="/admin/contactos" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-envelope me-2"></i> Gestionar Contactos
                    </Link>
                    <Link to="/admin/cursos" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-envelope me-2"></i> Gestionar Cursos
                    </Link>
                    <Link to="/admin/eventos" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-envelope me-2"></i> Gestionar Eventos
                    </Link>
                    <Link to="/admin/info" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-edit me-2"></i> Editar Información
                    </Link>
                    <Link to="/cursos/nuevo" className="user-menu-item" onClick={handleCloseOffcanvas}>
                      <i className="fas fa-graduation-cap me-2"></i> Crear Curso
                    </Link>
                  </>
                )}

                <hr />
                <Button variant="danger" className="logout-button w-100" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  )
}

export default MainNavbar
