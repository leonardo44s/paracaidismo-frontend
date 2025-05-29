"use client"

import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import infoService from "../../services/infoService"

const EditarInfo = () => {
  const { seccion } = useParams()
  const navigate = useNavigate()

  const [info, setInfo] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await infoService.getInfo(seccion)
        const contenidoObj = JSON.parse(data.contenido)

        setInfo(data)
        setFormData(contenidoObj)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar información:", error)
        setError("Error al cargar la información. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    if (seccion) {
      fetchInfo()
    } else {
      setLoading(false)
    }
  }, [seccion])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const contenidoString = JSON.stringify(formData)
      await infoService.updateInfo(seccion, contenidoString)
      setSuccess("Información actualizada con éxito")
    } catch (error) {
      console.error("Error al actualizar información:", error)
      setError("Error al actualizar la información. Por favor, intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  if (!seccion) {
    return (
      <Container className="py-5">
        <h1 className="mb-4">Gestión de Información</h1>
        <p>Selecciona una sección para editar:</p>
        <div className="d-grid gap-2 col-md-6 mx-auto">
          <Button variant="outline-primary" onClick={() => navigate("/admin/info/sobre_nosotros")}>
            Sobre Nosotros
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/admin/info/quienes_somos")}>
            Quiénes Somos
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/admin/info/contacto")}>
            Información de Contacto
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">
        Editar Información:{" "}
        {seccion === "sobre_nosotros"
          ? "Sobre Nosotros"
          : seccion === "quienes_somos"
            ? "Quiénes Somos"
            : "Información de Contacto"}
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {seccion === "sobre_nosotros" && (
              <>
                <Form.Group className="mb-3" controlId="titulo">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contenido">
                  <Form.Label>Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="contenido"
                    value={formData.contenido || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="imagen">
                  <Form.Label>URL de la imagen</Form.Label>
                  <Form.Control type="text" name="imagen" value={formData.imagen || ""} onChange={handleChange} />
                  <Form.Text className="text-muted">Deja en blanco para usar la imagen por defecto.</Form.Text>
                </Form.Group>
              </>
            )}

            {seccion === "quienes_somos" && (
              <>
                <Form.Group className="mb-3" controlId="titulo">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contenido">
                  <Form.Label>Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="contenido"
                    value={formData.contenido || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}

            {seccion === "contacto" && (
              <>
                <Form.Group className="mb-3" controlId="direccion">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="horario">
                  <Form.Label>Horario</Form.Label>
                  <Form.Control
                    type="text"
                    name="horario"
                    value={formData.horario || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate("/admin/info")}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default EditarInfo
