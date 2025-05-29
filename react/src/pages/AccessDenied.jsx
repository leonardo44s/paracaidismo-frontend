import { Container, Alert, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const AccessDenied = () => {
  return (
    <Container className="text-center mt-5">
      <Alert variant="danger">
        <Alert.Heading>Acceso Denegado</Alert.Heading>
        <p>No tienes permisos para acceder a esta página.</p>
      </Alert>
      <Link to="/">
        <Button variant="primary">Volver al Inicio</Button>
      </Link>
    </Container>
  )
}

export default AccessDenied
