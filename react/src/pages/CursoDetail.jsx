"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ListGroup, Modal, Form } from "react-bootstrap"
import { useParams, useNavigate, Link } from "react-router-dom"
import cursoService from "../services/cursoService"
import inscripcionService from "../services/inscripcionService"
import resenaService from "../services/resenaService"
import authService from "../services/authService"
import "../styles/curso-detail.css"

const CursoDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [curso, setCurso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInscripcionModal, setShowInscripcionModal] = useState(false)
  const [showResenaModal, setShowResenaModal] = useState(false)
  const [inscripcionForm, setInscripcionForm] = useState({
    fecha_preferida: "",
    comentarios: "",
  })
  const [resenaForm, setResenaForm] = useState({
    titulo: "",
    contenido: "",
    calificacion: 5,
  })
  const [inscribiendo, setInscribiendo] = useState(false)
  const [enviandoResena, setEnviandoResena] = useState(false)
  const [inscripcionExitosa, setInscripcionExitosa] = useState(false)
  const [resenaExitosa, setResenaExitosa] = useState(false)
  const [resenas, setResenas] = useState([])
  const [loadingResenas, setLoadingResenas] = useState(true)
  const [resenaError, setResenaError] = useState(null)

  const isAdmin = authService.hasRole("admin")
  const isInstructor = authService.hasRole("instructor")
  const isAuthenticated = authService.isAuthenticated()
  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        setLoading(true)
        const data = await cursoService.getById(id)
        console.log("Datos del curso:", data)
        setCurso(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar curso:", error)
        setError("Error al cargar los detalles del curso. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    const fetchResenas = async () => {
      try {
        setLoadingResenas(true)
        const data = await resenaService.getResenasByCurso(id)
        console.log("Reseñas del curso:", data)
        setResenas(data)
        setLoadingResenas(false)
      } catch (error) {
        console.error("Error al cargar reseñas:", error)
        setLoadingResenas(false)
      }
    }

    fetchCurso()
    fetchResenas()
  }, [id])

  const handleEliminar = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")) {
      try {
        await cursoService.delete(id)
        alert("Curso eliminado con éxito")
        navigate("/cursos")
      } catch (error) {
        console.error("Error al eliminar curso:", error)
        alert("Error al eliminar el curso. Por favor, intenta de nuevo.")
      }
    }
  }

  const handleInscripcionChange = (e) => {
    const { name, value } = e.target
    setInscripcionForm({
      ...inscripcionForm,
      [name]: value,
    })
  }

  const handleResenaChange = (e) => {
    const { name, value } = e.target
    setResenaForm({
      ...resenaForm,
      [name]: value,
    })
  }

  const handleSetCalificacion = (calificacion) => {
    setResenaForm({
      ...resenaForm,
      calificacion,
    })
  }

  const handleInscripcion = async (e) => {
    e.preventDefault();
  
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", `/cursos/${id}`);
      navigate("/login");
      return;
    }
  
    setInscribiendo(true);
  
    try {
      const datosInscripcion = {
        curso_id: id,
        ...inscripcionForm,
      };
      console.log("Datos enviados para inscripción:", datosInscripcion);
  
      await inscripcionService.inscribirCurso(id, inscripcionForm);
      setInscripcionExitosa(true);
  
      setTimeout(() => {
        setShowInscripcionModal(false);
        setTimeout(() => {
          navigate("/mis-inscripciones");
        }, 1000);
      }, 2000);
    } catch (error) {
      console.error("Error al realizar inscripción:", error);
      setError("Error al procesar la inscripción. Por favor, intenta de nuevo.");
    } finally {
      setInscribiendo(false);
    }
  };

  const handleEnviarResena = async (e) => {
    e.preventDefault();
    setResenaError(null);
    setEnviandoResena(true);
  
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", `/cursos/${id}`);
      navigate("/login");
      return;
    }
  
    try {
      const datosResena = {
        ...resenaForm,
        curso_id: id,
      };
      console.log("Enviando reseña:", datosResena);
  
      const response = await resenaService.createResena(datosResena);
      console.log("Respuesta del backend:", response);
  
      // Ajusta la lógica según la respuesta del backend
      if (response && response.message === "Reseña enviada exitosamente. Será revisada por un administrador.") {
        setResenaExitosa(true);
  
        setTimeout(() => {
          setShowResenaModal(false);
          // Recargar reseñas
          resenaService.getResenasByCurso(id).then((nuevasResenas) => {
            setResenas(nuevasResenas);
          });
        }, 2000);
      } else {
        setResenaError(response?.message || "Error desconocido al enviar la reseña.");
      }
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      setResenaError("Error al enviar la reseña. Por favor, intenta de nuevo.");
    } finally {
      setEnviandoResena(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" className="spinner-large" />
          <p className="mt-3 loading-text">Cargando detalles del curso...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      </Container>
    )
  }

  if (!curso) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Curso no encontrado
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5 curso-detail-container">
      <Row>
        <Col lg={8}>
          <Card className="curso-detail-card mb-4">
            <div className="curso-detail-image-container">
              <Card.Img
                variant="top"
                src={curso.imagen || "/placeholder.svg?height=400&width=800"}
                alt={curso.titulo}
                className="curso-detail-image"
              />
              <div className="curso-detail-badges">
                <Badge bg="primary" className="me-2 p-2">
                  {curso.nivel?.charAt(0).toUpperCase() + curso.nivel?.slice(1)}
                </Badge>
                <Badge bg="secondary" className="p-2">
                  <i className="fas fa-clock me-1"></i> {curso.duracion}
                </Badge>
              </div>
            </div>
            <Card.Body className="p-4">
              <div className="curso-detail-header">
                <Card.Title className="curso-detail-title">{curso.titulo}</Card.Title>

                <Card.Text className="curso-detail-instructor">
                  <i className="fas fa-user-tie me-2"></i>
                  Instructor: {curso.instructor_nombre} {curso.instructor_apellido}
                </Card.Text>
              </div>

              <div className="curso-detail-section">
                <h4 className="section-title">Descripción</h4>
                <Card.Text className="curso-detail-description">{curso.descripcion}</Card.Text>
              </div>

              <div className="curso-detail-section">
                <h4 className="section-title">¿Qué aprenderás?</h4>
                <ul className="curso-detail-list">
                  <li>
                    <i className="fas fa-check-circle text-success me-2"></i> Técnicas básicas de paracaidismo
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-success me-2"></i> Medidas de seguridad y protocolos
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-success me-2"></i> Manejo del equipo y paracaídas
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-success me-2"></i> Técnicas de aterrizaje seguro
                  </li>
                  {curso.nivel === "intermedio" || curso.nivel === "avanzado" ? (
                    <>
                      <li>
                        <i className="fas fa-check-circle text-success me-2"></i> Maniobras en caída libre
                      </li>
                      <li>
                        <i className="fas fa-check-circle text-success me-2"></i> Formaciones en grupo
                      </li>
                    </>
                  ) : null}
                  {curso.nivel === "avanzado" && (
                    <>
                      <li>
                        <i className="fas fa-check-circle text-success me-2"></i> Técnicas avanzadas de precisión
                      </li>
                      <li>
                        <i className="fas fa-check-circle text-success me-2"></i> Saltos nocturnos y especiales
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {(isAdmin || (isInstructor && currentUser?.id === curso.instructor_id)) && (
                <div className="mt-4 admin-actions">
                  <Link to={`/cursos/editar/${curso.id}`} className="btn btn-primary me-2">
                    <i className="fas fa-edit me-1"></i> Editar
                  </Link>
                  {isAdmin && (
                    <Button variant="danger" onClick={handleEliminar}>
                      <i className="fas fa-trash me-1"></i> Eliminar
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="curso-detail-card mb-4">
            <Card.Body>
              <h4 className="section-title">Requisitos</h4>
              <ListGroup variant="flush" className="requisitos-list">
                <ListGroup.Item>
                  <i className="fas fa-id-card me-2 text-primary"></i>
                  Ser mayor de 18 años (o 16 años con autorización de los padres)
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fas fa-weight me-2 text-primary"></i>
                  Peso máximo de 100 kg por razones de seguridad
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fas fa-heartbeat me-2 text-primary"></i>
                  Buena condición física general
                </ListGroup.Item>
                {curso.nivel === "intermedio" && (
                  <ListGroup.Item>
                    <i className="fas fa-certificate me-2 text-primary"></i>
                    Certificación de nivel principiante o equivalente
                  </ListGroup.Item>
                )}
                {curso.nivel === "avanzado" && (
                  <ListGroup.Item>
                    <i className="fas fa-certificate me-2 text-primary"></i>
                    Certificación de nivel intermedio o equivalente
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="curso-detail-card testimonials-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="section-title mb-0">Reseñas de Alumnos</h4>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowResenaModal(true)}
                  className="add-review-btn"
                >
                  <i className="fas fa-plus-circle me-1"></i> Añadir Reseña
                </Button>
              </div>

              {loadingResenas ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <p className="mt-2 text-muted">Cargando reseñas...</p>
                </div>
              ) : resenas.length > 0 ? (
                <div className="testimonials-container">
                  {resenas.map((resena) => (
                    <div className="testimonial" key={resena.id}>
                      <div className="testimonial-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="testimonial-content">
                        <h5>{resena.titulo}</h5>
                        <div className="testimonial-stars">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas ${i < resena.calificacion ? "fa-star" : "fa-star-o"}`}></i>
                          ))}
                          <span className="ms-2 text-muted">
                            {new Date(resena.fecha_creacion).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{resena.contenido}</p>
                        <div className="testimonial-author">
                          - {resena.nombre} {resena.apellido}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                  <p>Aún no hay reseñas para este curso.</p>
                  <p>¡Sé el primero en compartir tu experiencia!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-card mb-4">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">Detalles del curso</Card.Title>

              <ListGroup variant="flush" className="details-list mb-4">
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                  <span className="fw-bold">
                    <i className="fas fa-tag me-2"></i> Precio:
                  </span>
                  <span className="price-tag">${curso.precio}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                  <span className="fw-bold">
                    <i className="fas fa-signal me-2"></i> Nivel:
                  </span>
                  <Badge
                    bg={
                      curso.nivel === "principiante" ? "success" : curso.nivel === "intermedio" ? "warning" : "danger"
                    }
                    className="level-badge"
                  >
                    {curso.nivel?.charAt(0).toUpperCase() + curso.nivel?.slice(1)}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                  <span className="fw-bold">
                    <i className="fas fa-clock me-2"></i> Duración:
                  </span>
                  <span>{curso.duracion}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                  <span className="fw-bold">
                    <i className="fas fa-user-tie me-2"></i> Instructor:
                  </span>
                  <span>
                    {curso.instructor_nombre} {curso.instructor_apellido}
                  </span>
                </ListGroup.Item>
              </ListGroup>

              <Button
                variant="success"
                size="lg"
                className="inscripcion-button"
                onClick={() => setShowInscripcionModal(true)}
              >
                <i className="fas fa-check-circle me-2"></i> Inscribirse
              </Button>
            </Card.Body>
          </Card>
          <br />
          <Card className="info-card">
            <Card.Body className="p-4">
              <Card.Title className="mb-3">¿Necesitas más información?</Card.Title>
              <Card.Text>
                Si tienes dudas sobre este curso, no dudes en contactarnos. Estaremos encantados de ayudarte.
              </Card.Text>
              <Link to="/contacto" className="btn btn-outline-primary w-100">
                <i className="fas fa-envelope me-2"></i> Contactar
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de inscripción */}
      <Modal
        show={showInscripcionModal}
        onHide={() => !inscribiendo && setShowInscripcionModal(false)}
        centered
        className="inscripcion-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Inscripción al Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inscripcionExitosa ? (
            <div className="text-center py-4">
              <div className="success-checkmark">
                <i className="fas fa-check-circle fa-5x text-success"></i>
              </div>
              <h4 className="mt-4">¡Inscripción Exitosa!</h4>
              <p>Tu inscripción al curso ha sido procesada correctamente.</p>
              <p>Te redirigiremos a tus inscripciones en unos momentos...</p>
            </div>
          ) : (
            <Form onSubmit={handleInscripcion}>
              <Form.Group className="mb-3">
                <Form.Label>Curso seleccionado</Form.Label>
                <Form.Control type="text" value={curso.titulo} readOnly className="bg-light" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha preferida para iniciar</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_preferida"
                  value={inscripcionForm.fecha_preferida}
                  onChange={handleInscripcionChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Comentarios o preguntas (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="comentarios"
                  value={inscripcionForm.comentarios}
                  onChange={handleInscripcionChange}
                  placeholder="¿Tienes alguna pregunta o requerimiento especial?"
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={inscribiendo} className="py-2">
                  {inscribiendo ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle me-2"></i> Confirmar Inscripción
                    </>
                  )}
                </Button>
              </div>

              {!isAuthenticated && (
                <div className="text-center mt-3">
                  <small className="text-muted">Necesitarás iniciar sesión para completar la inscripción.</small>
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para añadir reseña */}
      <Modal
        show={showResenaModal}
        onHide={() => !enviandoResena && setShowResenaModal(false)}
        centered
        className="resena-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Reseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resenaExitosa ? (
            <div className="text-center py-4">
              <div className="success-checkmark">
                <i className="fas fa-check-circle fa-5x text-success"></i>
              </div>
              <h4 className="mt-4">¡Reseña Enviada!</h4>
              <p>Tu reseña ha sido enviada correctamente y será revisada por un administrador.</p>
            </div>
          ) : (
            <Form onSubmit={handleEnviarResena}>
              {resenaError && (
                <Alert variant="danger" className="mb-3">
                  {resenaError}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Título de la reseña</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={resenaForm.titulo}
                  onChange={handleResenaChange}
                  required
                  placeholder="Ej: Excelente curso para principiantes"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Calificación</Form.Label>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= resenaForm.calificacion ? "active" : ""}`}
                      onClick={() => handleSetCalificacion(star)}
                    ></i>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Tu opinión</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="contenido"
                  value={resenaForm.contenido}
                  onChange={handleResenaChange}
                  required
                  placeholder="Comparte tu experiencia con este curso..."
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={enviandoResena} className="py-2">
                  {enviandoResena ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i> Enviar Reseña
                    </>
                  )}
                </Button>
              </div>

              {!isAuthenticated && (
                <div className="text-center mt-3">
                  <small className="text-muted">Necesitarás iniciar sesión para enviar una reseña.</small>
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default CursoDetail
