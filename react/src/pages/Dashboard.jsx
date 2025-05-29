"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import eventoService from "../services/eventoService";
import inscripcionService from "../services/inscripcionService";
import resenaService from "../services/resenaService";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [misEventos, setMisEventos] = useState([]);
  const [misResenas, setMisResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Cargar inscripciones del usuario
        const inscripcionesData = await inscripcionService.getMisInscripciones();
        setInscripciones(inscripcionesData);

        // Cargar próximos eventos (limitado a 3)
        const eventosData = await eventoService.getEventos({ limit: 3 });
        setProximosEventos(eventosData);

        // Si es instructor o admin, cargar sus eventos
        if (currentUser && (currentUser.rol === "instructor" || currentUser.rol === "admin")) {
          const misEventosData = await eventoService.getMisEventos();
          setMisEventos(misEventosData);
        }

        // Cargar reseñas del usuario
        const resenasData = await resenaService.getMisResenas();
        setMisResenas(resenasData);

        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        setError("Error al cargar los datos. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <h2 className="mt-3">Cargando tu dashboard...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="dashboard-container py-5">
      <h1 className="mb-4">Bienvenido, {user?.nombre || "Usuario"}</h1>

      {/* Resumen de actividad */}
      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>Mis Inscripciones</Card.Title>
              <Card.Text className="dashboard-stat">{inscripciones.length}</Card.Text>
              <Button as={Link} to="/mis-inscripciones" variant="primary">
                Ver mis inscripciones
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>Mis Reseñas</Card.Title>
              <Card.Text className="dashboard-stat">{misResenas.length}</Card.Text>
              <Button as={Link} to="/mis-resenas" variant="primary">
                Ver mis reseñas
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>Mi Perfil</Card.Title>
              <Card.Text>Actualiza tu información personal</Card.Text>
              <Button as={Link} to="/perfil" variant="primary">
                Editar perfil
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Próximos eventos */}
      <h2 className="mb-3">Próximos Eventos</h2>
      <Row className="mb-5">
        {proximosEventos.length > 0 ? (
          proximosEventos.map((evento) => (
            <Col md={4} key={evento.id} className="mb-3">
              <Card className="dashboard-card h-100">
                <Card.Img
                  variant="top"
                  src={evento.imagen || "/placeholder.svg?height=180&width=320"}
                  alt={evento.titulo}
                  className="dashboard-card-img"
                />
                <Card.Body>
                  <Card.Title>{evento.titulo}</Card.Title>
                  <Card.Text>
                    <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}
                    <br />
                    <strong>Lugar:</strong> {evento.lugar}
                  </Card.Text>
                  <Button as={Link} to={`/eventos/${evento.id}`} variant="primary">
                    Ver detalles
                  </Button>
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

      {/* Sección para instructores */}
      {user && (user.rol === "instructor" || user.rol === "admin") && (
        <>
          <h2 className="mb-3">Mis Eventos (Instructor)</h2>
          <Row className="mb-5">
            {misEventos.length > 0 ? (
              misEventos.map((evento) => (
                <Col md={4} key={evento.id} className="mb-3">
                  <Card className="dashboard-card h-100">
                    <Card.Body>
                      <Card.Title>{evento.titulo}</Card.Title>
                      <Card.Text>
                        <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}
                        <br />
                        <strong>Participantes:</strong> {evento.participantes || 0}
                      </Card.Text>
                      <div className="d-flex gap-2">
                        <Button as={Link} to={`/eventos/${evento.id}`} variant="primary">
                          Ver
                        </Button>
                        <Button as={Link} to={`/eventos/editar/${evento.id}`} variant="secondary">
                          Editar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="info">No has creado ningún evento todavía.</Alert>
                <Button as={Link} to="/eventos/nuevo" variant="success" className="mt-2">
                  Crear nuevo evento
                </Button>
              </Col>
            )}
          </Row>
        </>
      )}

      {/* Sección para administradores */}
      {user && user.rol === "admin" && (
        <Row className="mb-5">
          <h2 className="mb-3">Administración</h2>
          <Col md={3} className="mb-3">
            <Card className="dashboard-card h-100">
              <Card.Body>
                <Card.Title>Usuarios</Card.Title>
                <Button as={Link} to="/admin/usuarios" variant="primary">
                  Gestionar usuarios
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="dashboard-card h-100">
              <Card.Body>
                <Card.Title>Cursos</Card.Title>
                <Button as={Link} to="/admin/cursos" variant="primary">
                  Gestionar cursos
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="dashboard-card h-100">
              <Card.Body>
                <Card.Title>Eventos</Card.Title>
                <Button as={Link} to="/admin/eventos" variant="primary">
                  Gestionar eventos
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="dashboard-card h-100">
              <Card.Body>
                <Card.Title>Reseñas</Card.Title>
                <Button as={Link} to="/admin/resenas" variant="primary">
                  Gestionar reseñas
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;