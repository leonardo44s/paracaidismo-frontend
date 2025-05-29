"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import EventosList from "./pages/EventosList"
import EventoDetail from "./pages/EventoDetail"
import Cursos from "./pages/Cursos"
import CursoDetail from "./pages/CursoDetail"
import InscripcionCurso from "./pages/InscripcionCurso"
import MisInscripciones from "./pages/MisInscripciones"
import MisResenas from "./pages/MisResenas"
import Perfil from "./pages/Perfil"
import AccessDenied from "./pages/AccessDenied"
import SobreNosotros from "./pages/SobreNosotros"
import Contacto from "./pages/Contacto"
import Resenas from "./pages/Resenas"
import QuieroSaltar from "./pages/QuieroSaltar"
import Profesional from "./pages/Profesional"

// Páginas de instructor
import MisEventos from "./pages/instructor/MisEventos"
import EventoForm from "./pages/instructor/EventoForm"

// Páginas de administrador
import UsersList from "./pages/admin/UsersList"
import GestionCursos from "./pages/admin/GestionCursos"
import GestionEventos from "./pages/admin/GestionEventos"
import GestionResenas from "./pages/admin/GestionResenas"
import GestionContactos from "./pages/admin/GestionContactos"
import EditarInfo from "./pages/admin/EditarInfo"
import CrearCurso from "./pages/CrearCurso"

// Servicios
import authService from "./services/authService"

// Componente para rutas protegidas
const PrivateRoute = ({ element, roles }) => {
  const currentUser = authService.getCurrentUser()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(currentUser.rol)) {
    return <Navigate to="/acceso-denegado" replace />
  }

  return element
}

function App() {
  useEffect(() => {
    // Verificar token al cargar la aplicación
    const token = localStorage.getItem("token")
    if (token) {
      try {
        // Verificar si el token es válido
        const user = authService.getCurrentUser()
        if (!user) {
          // Si no hay usuario, el token no es válido
          authService.logout()
        }
      } catch (error) {
        console.error("Error al verificar token:", error)
        authService.logout()
      }
    }
  }, [])

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/eventos" element={<EventosList />} />
            <Route path="/eventos/:id" element={<EventoDetail />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/cursos/:id" element={<CursoDetail />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/resenas" element={<Resenas />} />
            <Route path="/quiero-saltar" element={<QuieroSaltar />} />
            <Route path="/profesional" element={<Profesional />} />
            <Route path="/acceso-denegado" element={<AccessDenied />} />

            {/* Rutas protegidas para usuarios autenticados */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/perfil" element={<PrivateRoute element={<Perfil />} />} />
            <Route path="/mis-inscripciones" element={<PrivateRoute element={<MisInscripciones />} />} />
            <Route path="/mis-resenas" element={<PrivateRoute element={<MisResenas />} />} />
            <Route path="/cursos/:id/inscripcion" element={<PrivateRoute element={<InscripcionCurso />} />} />

            {/* Rutas para instructores y admin */}
            <Route
              path="/mis-eventos"
              element={<PrivateRoute element={<MisEventos />} roles={["instructor", "admin"]} />}
            />
            <Route
              path="/eventos/nuevo"
              element={<PrivateRoute element={<EventoForm />} roles={["instructor", "admin"]} />}
            />
            <Route
              path="/eventos/editar/:id"
              element={<PrivateRoute element={<EventoForm />} roles={["instructor", "admin"]} />}
            />

            {/* Rutas para admin */}
            <Route path="/admin/usuarios" element={<PrivateRoute element={<UsersList />} roles={["admin"]} />} />
            <Route path="/admin/cursos" element={<PrivateRoute element={<GestionCursos />} roles={["admin"]} />} />
            <Route path="/admin/eventos" element={<PrivateRoute element={<GestionEventos />} roles={["admin"]} />} />
            <Route path="/admin/resenas" element={<PrivateRoute element={<GestionResenas />} roles={["admin"]} />} />
            <Route
              path="/admin/contactos"
              element={<PrivateRoute element={<GestionContactos />} roles={["admin"]} />}
            />
            <Route path="/admin/info" element={<PrivateRoute element={<EditarInfo />} roles={["admin"]} />} />
            <Route path="/admin/info/:seccion" element={<PrivateRoute element={<EditarInfo />} roles={["admin"]} />} />
            <Route
              path="/cursos/nuevo"
              element={<PrivateRoute element={<CrearCurso />} roles={["admin", "instructor"]} />}
            />
            <Route
              path="/cursos/editar/:id"
              element={<PrivateRoute element={<CrearCurso />} roles={["admin", "instructor"]} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
