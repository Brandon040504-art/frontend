import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardMaestro from './pages/DashboardMaestro'
import DashboardAlumno from './pages/DashboardAlumno'
import API from './services/api'

function PrivateRoute({ children, rolesAllowed }) {
  const token = localStorage.getItem('token')
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await API.get('/auth/me')
        setUserRole(res.data.rol)
      } catch {
        localStorage.removeItem('token')
      }
      setLoading(false)
    }
    fetchUser()
  }, [token])

  if (loading) return <p>Cargando...</p>
  if (!token) return <Navigate to="/" />
  if (rolesAllowed && !rolesAllowed.includes(userRole)) return <Navigate to="/" />
  return children
}

export default function App() {
  const navigate = useNavigate()

  // Opcional: en login ya guardas token y llamas a esta función para redirigir según rol
  const handleRedirectDashboard = async () => {
    try {
      const res = await API.get('/auth/me')
      const rol = res.data.rol
      if (rol === 'maestro') navigate('/dashboard-maestro')
      else if (rol === 'alumno') navigate('/dashboard-alumno')
      else navigate('/')
    } catch {
      navigate('/')
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleRedirectDashboard} />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard-maestro"
        element={
          <PrivateRoute rolesAllowed={['maestro']}>
            <DashboardMaestro />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard-alumno"
        element={
          <PrivateRoute rolesAllowed={['alumno']}>
            <DashboardAlumno />
          </PrivateRoute>
        }
      />
      {/* Puedes agregar ruta 404 si quieres */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}


