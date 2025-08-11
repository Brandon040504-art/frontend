import { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

export default function DashboardAlumno() {
  const [calificaciones, setCalificaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const resUser = await API.get('/auth/me')
        const idAlumno = resUser.data._id
        const resCalif = await API.get(`/calificaciones/alumno/${idAlumno}`)
        setCalificaciones(resCalif.data)
      } catch {
        alert('Error al cargar calificaciones')
      } finally {
        setLoading(false)
      }
    }
    fetchCalificaciones()
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
        <h2>Mis Calificaciones</h2>

        {loading ? (
          <p>Cargando calificaciones...</p>
        ) : calificaciones.length === 0 ? (
          <p>No tienes calificaciones registradas aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Materia</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map(c => (
                <tr key={c._id}>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{c.materia.nombre}</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{c.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

