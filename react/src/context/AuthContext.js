import { createContext, useContext, useState, useEffect } from "react"
import authService from "../services/authService"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = authService.getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  // Iniciar sesión
  const login = async (credentials) => {
    const data = await authService.login(credentials)
    if (data?.user) {
      setUser(data.user)
    }
    return data
  }

  // Cerrar sesión
  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext)
