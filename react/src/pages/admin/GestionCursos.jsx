"use client"

import { useState, useEffect } from "react"
import { Container, Table, Button, Alert, Spinner, Badge, Card, Row, Col, Form, InputGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import cursoService from "../../services/cursoService"
import "../../styles/admin.css"

const GestionCursos = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("")

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true)
        const data = await cursoService.getAll()
        setCursos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar cursos:", error)
        setError("Error al cargar los cursos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchCursos()
  }, [])

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")) {
      try {
        await cursoService.delete(id)
        setCursos(cursos.filter((curso) => curso.id !== id))
        alert("Curso eliminado con éxito")
      } catch (error) {
        console.error("Error al eliminar curso:", error)
        alert("Error al eliminar el curso. Por favor, intenta de nuevo.")
      }
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleLevelChange = (e) => {
    setFilterLevel(e.target.value)
  }

  // Filtrar cursos
  const filteredCursos = cursos.filter((curso) => {
    const matchesSearch =
      curso.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.instructor_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.instructor_apellido?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = filterLevel ? curso.nivel === filterLevel : true

    return matchesSearch && matchesLevel
  })

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando cursos...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5 admin-container">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Gestión de Cursos</h3>
          <Link to="/cursos/nuevo" className="btn btn-light">
            <i className="fas fa-plus-circle me-2"></i> Nuevo Curso
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
                  placeholder="Buscar por título, descripción o instructor..."
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
              <Form.Select value={filterLevel} onChange={handleLevelChange}>
                <option value="">Todos los niveles</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Form.Select>
            </Col>
          </Row>

          {filteredCursos.length > 0 ? (
            <Table responsive striped hover className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Nivel</th>
                  <th>Duración</th>
                  <th>Precio</th>
                  <th>Instructor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.titulo}</td>
                    <td>
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
                    </td>
                    <td>{curso.duracion}</td>
                    <td>${curso.precio}</td>
                    <td>
                      {curso.instructor_nombre} {curso.instructor_apellido}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/cursos/${curso.id}`} className="btn btn-sm btn-info">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to={`/cursos/editar/${curso.id}`} className="btn btn-sm btn-primary">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleEliminar(curso.id)}>
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
              No se encontraron cursos con los criterios de búsqueda.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default GestionCursos
