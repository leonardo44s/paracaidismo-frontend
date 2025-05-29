"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap"

const Profesional = () => {
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo para la página
  const [servicios, setServicios] = useState([
    {
      id: 1,
      titulo: "Certificación USPA A",
      descripcion: "Primera licencia para paracaidistas. Incluye entrenamiento completo y saltos supervisados.",
      requisitos: ["Completar curso AFF", "Mínimo 25 saltos", "Aprobar examen teórico"],
      precio: "$599",
      imagen:
        "https://images.unsplash.com/photo-1521673252667-e05da380b252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      titulo: "Certificación USPA B",
      descripcion: "Nivel intermedio que permite realizar saltos en formación y usar cámaras durante el salto.",
      requisitos: ["Licencia A", "Mínimo 50 saltos", "Aprobar examen práctico"],
      precio: "$799",
      imagen:
        "https://images.unsplash.com/photo-1601024445121-e5b82f020549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      titulo: "Certificación USPA C",
      descripcion: "Nivel avanzado que permite realizar saltos nocturnos y participar en competiciones.",
      requisitos: ["Licencia B", "Mínimo 200 saltos", "Aprobar evaluación avanzada"],
      precio: "$999",
      imagen:
        "https://images.unsplash.com/photo-1629033910382-75a1d9cad3c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      titulo: "Certificación USPA D",
      descripcion:
        "Máximo nivel de certificación. Permite realizar demostraciones públicas y entrenar a otros paracaidistas.",
      requisitos: ["Licencia C", "Mínimo 500 saltos", "Evaluación completa"],
      precio: "$1,299",
      imagen:
        "https://images.unsplash.com/photo-1603798125914-7b5d27789248?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
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
        <p className="mt-3">Cargando servicios profesionales...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5 mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Servicios Profesionales</h1>
        <p className="lead">Lleva tu pasión por el paracaidismo al siguiente nivel</p>
      </div>

      {/* Banner principal */}
      <div
        className="p-5 mb-5 rounded-3 text-white"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1568283644546-55fadcf32555?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-fluid py-5">
          <h2 className="display-5 fw-bold">Formación Profesional</h2>
          <p className="col-md-8 fs-4">
            Ofrecemos programas completos de formación para convertirte en un paracaidista certificado. Nuestros
            instructores cuentan con miles de saltos y certificaciones internacionales.
          </p>
          <Button variant="primary" size="lg" className="mt-3">
            <i className="fas fa-graduation-cap me-2"></i>
            Conoce Nuestros Programas
          </Button>
        </div>
      </div>

      <h2 className="mb-4">Certificaciones Disponibles</h2>

      <Row>
        {servicios.map((servicio) => (
          <Col md={6} className="mb-4" key={servicio.id}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Row className="g-0">
                <Col md={4}>
                  <Card.Img
                    src={servicio.imagen}
                    alt={servicio.titulo}
                    className="h-100"
                    style={{ objectFit: "cover" }}
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title>{servicio.titulo}</Card.Title>
                      <Badge bg="primary">Certificación</Badge>
                    </div>
                    <Card.Text>{servicio.descripcion}</Card.Text>

                    <h6 className="mt-3">Requisitos:</h6>
                    <ul className="small">
                      {servicio.requisitos.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fs-5 fw-bold text-primary">{servicio.precio}</span>
                      <Button variant="outline-primary">
                        <i className="fas fa-info-circle me-1"></i> Más Detalles
                      </Button>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Sección de servicios adicionales */}
      <h2 className="mt-5 mb-4">Servicios Adicionales</h2>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 text-center p-4 hover-card">
            <div className="icon-wrapper mb-3">
              <i className="fas fa-tools fa-3x text-primary"></i>
            </div>
            <Card.Title>Mantenimiento de Equipos</Card.Title>
            <Card.Text>
              Servicio profesional de mantenimiento y reparación de paracaídas y equipos. Realizado por técnicos
              certificados.
            </Card.Text>
            <Button variant="outline-primary" className="mt-auto">
              Solicitar Servicio
            </Button>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 text-center p-4 hover-card">
            <div className="icon-wrapper mb-3">
              <i className="fas fa-video fa-3x text-primary"></i>
            </div>
            <Card.Title>Fotografía y Video Profesional</Card.Title>
            <Card.Text>
              Captura tus saltos con nuestro equipo de fotógrafos especializados en paracaidismo. Edición profesional
              incluida.
            </Card.Text>
            <Button variant="outline-primary" className="mt-auto">
              Ver Paquetes
            </Button>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 text-center p-4 hover-card">
            <div className="icon-wrapper mb-3">
              <i className="fas fa-store fa-3x text-primary"></i>
            </div>
            <Card.Title>Tienda Especializada</Card.Title>
            <Card.Text>
              Equipos, accesorios y ropa especializada para paracaidismo. Asesoramiento personalizado para tu compra.
            </Card.Text>
            <Button variant="outline-primary" className="mt-auto">
              Visitar Tienda
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Sección de instructores */}
      <div className="mt-5">
        <h2 className="mb-4">Nuestros Instructores</h2>

        <Row>
          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm text-center hover-card">
              <Card.Img
                variant="top"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Instructor"
                className="rounded-circle mx-auto mt-4"
                style={{ width: "120px", height: "120px" }}
              />
              <Card.Body>
                <Card.Title>Carlos Rodríguez</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Instructor Jefe</Card.Subtitle>
                <Card.Text>
                  +5,000 saltos
                  <br />
                  Certificación USPA Tandem
                  <br />
                  15 años de experiencia
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm text-center hover-card">
              <Card.Img
                variant="top"
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Instructora"
                className="rounded-circle mx-auto mt-4"
                style={{ width: "120px", height: "120px" }}
              />
              <Card.Body>
                <Card.Title>Laura Martínez</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Instructora AFF</Card.Subtitle>
                <Card.Text>
                  +3,200 saltos
                  <br />
                  Especialista en formación
                  <br />
                  10 años de experiencia
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm text-center hover-card">
              <Card.Img
                variant="top"
                src="https://randomuser.me/api/portraits/men/67.jpg"
                alt="Instructor"
                className="rounded-circle mx-auto mt-4"
                style={{ width: "120px", height: "120px" }}
              />
              <Card.Body>
                <Card.Title>Miguel Sánchez</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Instructor Tándem</Card.Subtitle>
                <Card.Text>
                  +4,500 saltos
                  <br />
                  Campeón nacional 2019
                  <br />
                  12 años de experiencia
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm text-center hover-card">
              <Card.Img
                variant="top"
                src="https://randomuser.me/api/portraits/women/33.jpg"
                alt="Instructora"
                className="rounded-circle mx-auto mt-4"
                style={{ width: "120px", height: "120px" }}
              />
              <Card.Body>
                <Card.Title>Ana López</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Instructora de Freestyle</Card.Subtitle>
                <Card.Text>
                  +2,800 saltos
                  <br />
                  Especialista en acrobacias
                  <br />8 años de experiencia
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Call to action */}
      <div className="bg-primary text-white p-5 rounded-3 mt-5 text-center">
        <h2>¿Listo para convertirte en un profesional?</h2>
        <p className="lead">
          Contáctanos hoy mismo para obtener más información sobre nuestros programas de formación.
        </p>
        <Button variant="light" size="lg" className="mt-3">
          <i className="fas fa-paper-plane me-2"></i>
          Solicitar Información
        </Button>
      </div>
    </Container>
  )
}

export default Profesional
