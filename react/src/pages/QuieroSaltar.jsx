"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"

const QuieroSaltar = () => {
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo para la página
  const [opciones, setOpciones] = useState([
    {
      id: 1,
      titulo: "Salto Tándem",
      descripcion:
        "Experimenta la adrenalina del paracaidismo junto a un instructor experimentado. ¡No se requiere experiencia previa!",
      precio: "$299",
      imagen:
        "https://images.unsplash.com/photo-1521673252667-e05da380b252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      nivel: "Principiante",
      duracion: "30 minutos",
      destacado: true,
    },
    {
      id: 2,
      titulo: "Curso AFF (Accelerated Free Fall)",
      descripcion:
        "Programa completo de formación para convertirte en paracaidista autónomo. Incluye teoría y saltos prácticos.",
      precio: "$1,499",
      imagen:
        "https://images.unsplash.com/photo-1601024445121-e5b82f020549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      nivel: "Intermedio",
      duracion: "1 semana",
      destacado: false,
    },
    {
      id: 3,
      titulo: "Salto Grupal",
      descripcion:
        "Vive la experiencia de saltar en grupo con amigos o familiares. Descuentos especiales para grupos de 4 o más personas.",
      precio: "$249/persona",
      imagen:
        "https://images.unsplash.com/photo-1629033910382-75a1d9cad3c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      nivel: "Principiante",
      duracion: "45 minutos",
      destacado: false,
    },
    {
      id: 4,
      titulo: "Salto Fotográfico",
      descripcion:
        "Incluye un fotógrafo profesional que saltará contigo para capturar cada momento de tu experiencia en fotos y video.",
      precio: "$399",
      imagen:
        "https://images.unsplash.com/photo-1603798125914-7b5d27789248?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      nivel: "Principiante",
      duracion: "30 minutos",
      destacado: true,
    },
  ])

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando opciones de salto...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">¿Listo para Saltar?</h1>
        <p className="lead">Elige la experiencia que mejor se adapte a ti</p>
      </div>

      {/* Banner destacado */}
      <div
        className="p-5 mb-5 rounded-3 text-white"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1502666761775-9de932e76e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-fluid py-5">
          <h2 className="display-5 fw-bold">Primera vez saltando?</h2>
          <p className="col-md-8 fs-4">
            No te preocupes, nuestro salto tándem es perfecto para principiantes. Saltarás conectado a un instructor
            experimentado que se encargará de todo.
          </p>
          
          <Button as={Link} to="/contacto" variant="primary" size="lg" className="mt-3">
          <i className="fas fa-parachute-box me-2"></i>
          Reservar Salto Tándem
          </Button>
        </div>
      </div>

      <h2 className="mb-4">Nuestras Opciones de Salto</h2>

      <Row>
        {opciones.map((opcion) => (
          <Col md={6} lg={3} className="mb-4" key={opcion.id}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={opcion.imagen}
                  alt={opcion.titulo}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                {opcion.destacado && (
                  <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                    Destacado
                  </span>
                )}
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge bg="primary">{opcion.nivel}</Badge>
                  <small className="text-muted">
                    <i className="far fa-clock me-1"></i>
                    {opcion.duracion}
                  </small>
                </div>
                <Card.Title>{opcion.titulo}</Card.Title>
                <Card.Text>{opcion.descripcion}</Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fs-5 fw-bold text-primary">{opcion.precio}</span>
                  <Button variant="outline-primary">
                    <i className="fas fa-info-circle me-1"></i> Más Info
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="bg-light p-4 rounded-3 mt-5">
        <Row className="align-items-center">
          <Col md={8}>
            <h3>¿Tienes dudas sobre qué opción elegir?</h3>
            <p className="mb-0">
              Nuestro equipo está disponible para ayudarte a elegir la mejor experiencia según tus necesidades.
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Link to="/contacto" className="btn btn-primary">
              <i className="fas fa-envelope me-2"></i>
              Contáctanos
            </Link>
          </Col>
        </Row>
      </div>

      {/* Sección de preguntas frecuentes */}
      <div className="mt-5">
        <h3 className="mb-4">Preguntas Frecuentes</h3>

        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                ¿Necesito experiencia previa para saltar?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                No, para el salto tándem no necesitas experiencia previa. Nuestros instructores te darán una breve
                capacitación antes del salto y estarán contigo durante toda la experiencia.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                ¿Hay límites de edad o peso?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                La edad mínima es de 18 años. Para menores entre 16 y 17 años, se requiere autorización de los padres.
                El peso máximo es de 100 kg por razones de seguridad.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                ¿Qué debo llevar para mi salto?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Recomendamos ropa cómoda y zapatillas deportivas. Te proporcionaremos todo el equipo necesario para el
                salto, incluyendo el traje, gafas y arnés.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq4"
              >
                ¿Puedo llevar mi cámara o teléfono durante el salto?
              </button>
            </h2>
            <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Por razones de seguridad, no se permite llevar objetos personales durante el salto. Ofrecemos servicios
                de fotografía y video profesional para que puedas tener un recuerdo de tu experiencia.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default QuieroSaltar
