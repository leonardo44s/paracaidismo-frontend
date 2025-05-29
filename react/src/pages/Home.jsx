"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import eventoService from "../services/eventoService"
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventoService.getAll()
        // Mostrar solo los próximos 3 eventos
        setEventos(data.slice(0, 3))
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar eventos:", error)
        setError("Error al cargar los eventos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchEventos()
  }, [])

  return (
    <Container>
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">¡Bienvenido a Aeródromo de Paracaidismo!</h1>
        <p className="lead">
          Experimenta la adrenalina de volar en caída libre y disfruta de las mejores vistas desde el cielo.
        </p>
        <hr className="my-4" />
        <p>
          Ofrecemos cursos para todos los niveles, desde principiantes hasta expertos. ¡Únete a nuestra comunidad de
          paracaidistas!
        </p>
        <Link to="/eventos" className="btn btn-primary btn-lg">
          Ver Eventos
        </Link>
      </div>

      <h2 className="mb-4">Próximos Eventos</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <Col md={4} className="mb-4" key={evento.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{evento.titulo}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(evento.fecha).toLocaleDateString()} - {evento.hora}
                    </Card.Subtitle>
                    <Card.Text>
                      {evento.descripcion?.substring(0, 100)}
                      {evento.descripcion?.length > 100 ? "..." : ""}
                    </Card.Text>
                    <Card.Text>
                      <strong>Lugar:</strong> {evento.lugar}
                    </Card.Text>
                    <Link to={`/eventos/${evento.id}`} className="btn btn-primary">
                      Ver Detalles
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No hay eventos próximos programados.</Alert>
            </Col>
          )}
        </Row>
      )}

      <div className="text-center mt-4 mb-5">
        <Link to="/eventos" className="btn btn-outline-primary">
          Ver Todos los Eventos
        </Link>
      </div>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Cursos para Principiantes</Card.Title>
              <Card.Text>
                ¿Nunca has saltado en paracaídas? Nuestros instructores certificados te guiarán en tu primera
                experiencia.
              </Card.Text>
              <Button as={Link} to="/contacto" variant="outline-primary" className="mt-auto">
              Más Información
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Saltos en Tándem</Card.Title>
              <Card.Text>
                Experimenta la adrenalina del paracaidismo junto a un instructor experimentado. ¡No se requiere
                experiencia previa!
              </Card.Text>
              <Button as={Link} to="/contacto" variant="outline-primary" className="mt-auto">
              Más Información
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Formación Avanzada</Card.Title>
              <Card.Text>
                Para paracaidistas experimentados que desean mejorar sus habilidades y técnicas de vuelo.
              </Card.Text>
              <Button as={Link} to="/contacto" variant="outline-primary" className="mt-auto">
              Más Información
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
