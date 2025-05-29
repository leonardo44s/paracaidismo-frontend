import { Link } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Paracaidismo Extremo</h5>
            <p className="small">
              Ofrecemos la mejor experiencia de paracaidismo con instructores certificados y equipo de alta calidad.
            </p>
          </Col>
          <Col md={4}>
            <h5>Enlaces rápidos</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/cursos" className="text-white">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-white">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-white">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <address className="small">
              <p>
                Aeródromo de Paracaidismo
                <br />
                Av 6 cll 3 #34-33
                <br />
                Ciudad, Cali
              </p>
              <p>
                Email: info@paracaidismo.com
                <br />
                Teléfono: +57 3145530527
              </p>
            </address>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p className="small mb-0">&copy; {currentYear} Paracaidismo Extremo. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
