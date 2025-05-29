import { Navigate, Outlet, useLocation } from "react-router-dom"
import authService from "../services/authService"

const PrivateRoute = ({ roles }) => {
  const location = useLocation()
  const currentUser = authService.getCurrentUser()

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si se especifican roles y el usuario no tiene el rol requerido
  if (roles && !roles.includes(currentUser.rol)) {
    return <Navigate to="/acceso-denegado" replace />
  }

  // Si todo está bien, mostrar el componente hijo
  return <Outlet />
}

export default PrivateRoute
