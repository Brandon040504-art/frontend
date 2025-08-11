import { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

export default function DashboardMaestro() {
  const [materias, setMaterias] = useState([])
  const [nombreMateria, setNombreMateria] = useState('')
  const [alumnoId, setAlumnoId] = useState('')
  const [materiaId, setMateriaId] = useState('')
  const [nota, setNota] = useState('')
  const [alumnos, setAlumnos] = useState([])
  const [errorMateria, setErrorMateria] = useState('')
  const [errorCalificacion, setErrorCalificacion] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMaterias = await API.get('/materias')
        setMaterias(resMaterias.data)

        const resAlumnos = await API.get('/auth/usuarios?rol=alumno')
        setAlumnos(resAlumnos.data)
      } catch (err) {
        alert('Error cargando datos')
      }
    }
    fetchData()
  }, [])

  const agregarMateria = async () => {
    setErrorMateria('')
    if (nombreMateria.trim() === '') {
      setErrorMateria('El nombre de la materia es obligatorio')
      return
    }
    try {
      const res = await API.post('/materias', { nombre: nombreMateria })
      setMaterias([...materias, res.data])
      setNombreMateria('')
    } catch (err) {
      setErrorMateria('Error al agregar materia')
    }
  }

  const ponerCalificacion = async () => {
    setErrorCalificacion('')
    if (!alumnoId || !materiaId || nota === '') {
      setErrorCalificacion('Todos los campos son obligatorios')
      return
    }
    const notaNum = Number(nota)
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 100) {
      setErrorCalificacion('La nota debe ser un número entre 0 y 100')
      return
    }

    try {
      await API.post('/calificaciones', { alumno: alumnoId, materia: materiaId, nota: notaNum })
      alert('Calificación registrada')
      setAlumnoId('')
      setMateriaId('')
      setNota('')
    } catch (err) {
      setErrorCalificacion('Error al poner calificación')
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
        <h2>Dashboard Maestro</h2>

        <section style={{ marginBottom: '2rem' }}>
          <h3>Agregar Materia</h3>
          <input
            style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
            value={nombreMateria}
            onChange={e => setNombreMateria(e.target.value)}
            placeholder="Nombre de la materia"
          />
          <button onClick={agregarMateria} style={{ padding: '0.5rem 1rem' }}>Agregar</button>
          {errorMateria && <p style={{ color: 'red' }}>{errorMateria}</p>}
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3>Lista de Materias</h3>
          {materias.length === 0 ? (
            <p>No hay materias registradas.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Nombre</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Maestro</th>
                </tr>
              </thead>
              <tbody>
                {materias.map(m => (
                  <tr key={m._id}>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{m.nombre}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                      {m.maestro?.nombre || 'Sin asignar'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h3>Poner Calificación</h3>
          <div style={{ marginBottom: '0.5rem' }}>
            <select
              style={{ padding: '0.5rem', width: '200px', marginRight: '1rem' }}
              value={alumnoId}
              onChange={e => setAlumnoId(e.target.value)}
            >
              <option value="">Selecciona alumno</option>
              {alumnos.map(a => (
                <option key={a._id} value={a._id}>{a.nombre}</option>
              ))}
            </select>

            <select
              style={{ padding: '0.5rem', width: '200px', marginRight: '1rem' }}
              value={materiaId}
              onChange={e => setMateriaId(e.target.value)}
            >
              <option value="">Selecciona materia</option>
              {materias.map(m => (
                <option key={m._id} value={m._id}>{m.nombre}</option>
              ))}
            </select>

            <input
              type="number"
              style={{ padding: '0.5rem', width: '100px', marginRight: '1rem' }}
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="Nota"
              min="0"
              max="100"
            />
            <button onClick={ponerCalificacion} style={{ padding: '0.5rem 1rem' }}>Registrar</button>
          </div>
          {errorCalificacion && <p style={{ color: 'red' }}>{errorCalificacion}</p>}
        </section>
      </div>
    </>
  )
}
