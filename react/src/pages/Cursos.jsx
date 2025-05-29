"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, InputGroup, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import cursoService from "../services/cursoService"
import authService from "../services/authService"
import "../styles/cursos.css"
import '@fortawesome/fontawesome-free/css/all.min.css';

const Cursos = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("todos")
  const [animateCards, setAnimateCards] = useState(false)

  const isAdmin = authService.hasRole("admin")
  const isInstructor = authService.hasRole("instructor")

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true)
        const data = await cursoService.getAll()
        setCursos(data)
        setLoading(false)
        // Activar animación después de cargar los datos
        setTimeout(() => setAnimateCards(true), 100)
      } catch (error) {
        console.error("Error al cargar cursos:", error)
        setError("Error al cargar los cursos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchCursos()
  }, [])

  // Filtrar cursos según búsqueda y nivel
  const filteredCursos = cursos.filter((curso) => {
    const matchesSearch =
      curso.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = filterLevel === "todos" || curso.nivel === filterLevel

    return matchesSearch && matchesLevel
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilterLevel(e.target.value)
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" className="spinner-large" />
          <p className="mt-3 loading-text">Cargando cursos...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5 mt-5">
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-4 cursos-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold text-gradient">Nuestros Cursos</h1>
        <p className="lead">Descubre nuestras opciones de formación en paracaidismo</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="search-filter-container p-4 rounded-lg shadow-sm mb-5"
      >
        <Row>
          <Col md={8}>
            <InputGroup className="mb-3 mb-md-0 search-input">
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-control"
              />
              {searchTerm && (
                <Button variant="outline-secondary" onClick={() => setSearchTerm("")} className="clear-button">
                  <i className="fas fa-times"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select value={filterLevel} onChange={handleFilterChange} className="filter-select">
              <option value="todos">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </Form.Select>
          </Col>
        </Row>
      </motion.div>

      {(isAdmin || isInstructor) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-end mb-4"
        >
          <Link to="/cursos/nuevo" className="btn btn-primary btn-lg create-button">
            <i className="fas fa-plus me-2"></i> Nuevo Curso
          </Link>
        </motion.div>
      )}

      {filteredCursos.length > 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate={animateCards ? "visible" : "hidden"}>
          <Row>
            {filteredCursos.map((curso, index) => (
              <Col md={6} lg={4} className="mb-4" key={curso.id || index}>
                <motion.div variants={itemVariants}>
                  <Card className="curso-card h-100 shadow border-0">
                    <div className="curso-image-container">
                      <Card.Img
                        variant="top"
                        src={curso.imagen || "/placeholder.svg?height=200&width=400"}
                        alt={curso.titulo}
                        className="curso-image"
                      />
                      <div className="curso-overlay">
                        <Link to={`/cursos/${curso.id}`} className="btn btn-light btn-sm">
                          <i className="fas fa-eye me-1"></i> Ver detalles
                        </Link>
                      </div>
                      <div className="curso-badge">
                        <Badge
                          bg={
                            curso.nivel === "principiante"
                              ? "success"
                              : curso.nivel === "intermedio"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {curso.nivel?.charAt(0).toUpperCase() + curso.nivel?.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title className="curso-title">{curso.titulo}</Card.Title>
                      <div className="curso-info">
                        <span>
                          <i className="fas fa-user me-1"></i> {curso.instructor_nombre} {curso.instructor_apellido}
                        </span>
                        <span>
                          <i className="fas fa-clock me-1"></i> {curso.duracion}
                        </span>
                      </div>
                      <Card.Text className="curso-description">
                        {curso.descripcion?.substring(0, 100)}
                        {curso.descripcion?.length > 100 ? "..." : ""}
                      </Card.Text>
                      <div className="curso-footer">
                        <span className="curso-price">${curso.precio}</span>
                        <Link to={`/cursos/${curso.id}`} className="btn btn-outline-primary">
                          Más información
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Alert variant="info" className="text-center no-results">
            <i className="fas fa-info-circle me-2 fa-lg"></i>
            No se encontraron cursos con los criterios de búsqueda.
            <div className="mt-3">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSearchTerm("")
                  setFilterLevel("todos")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="cta-container text-center mt-5 p-5 rounded"
      >
        <h2>¿No encuentras lo que buscas?</h2>
        <p className="lead">Contáctanos para obtener información personalizada sobre nuestros cursos</p>
        <Link to="/contacto" className="btn btn-primary btn-lg mt-3">
          <i className="fas fa-envelope me-2"></i> Contactar
        </Link>
      </motion.div>
    </Container>
  )
}

export default Cursos
