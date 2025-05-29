"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap"
import infoService from "../services/infoService"

const SobreNosotros = () => {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await infoService.getInfo("sobre_nosotros")
        setInfo(JSON.parse(data.contenido))
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar información:", error)
        setError("Error al cargar la información. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchInfo()
  }, [])

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">{info?.titulo || "Sobre Nosotros"}</h1>

      <Row className="align-items-center mb-5">
        <Col md={6}>
          <div dangerouslySetInnerHTML={{ __html: info?.contenido }} />
        </Col>
        <Col md={6}>
          <img
            src={info?.imagen || "/placeholder.svg?height=400&width=600"}
            alt="Sobre Nosotros"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-medal fa-3x text-primary"></i>
              </div>
              <Card.Title>Experiencia</Card.Title>
              <Card.Text>
                Más de 10 años de experiencia en el mundo del paracaidismo, con instructores certificados
                internacionalmente.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-shield-alt fa-3x text-primary"></i>
              </div>
              <Card.Title>Seguridad</Card.Title>
              <Card.Text>
                La seguridad es nuestra prioridad. Utilizamos equipos de última generación y seguimos estrictos
                protocolos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-users fa-3x text-primary"></i>
              </div>
              <Card.Title>Comunidad</Card.Title>
              <Card.Text>
                Somos una comunidad apasionada por el paracaidismo. Únete a nosotros y comparte experiencias increíbles.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SobreNosotros
