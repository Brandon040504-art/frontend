import { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('alumno')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (nombre.trim() === '') {
      setError('El nombre es obligatorio')
      return
    }
    if (!validarEmail(email)) {
      setError('Email no válido')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      await API.post('/auth/register', { nombre, email, password, rol })
      alert('Registro exitoso, ahora inicia sesión')
      navigate('/')
    } catch {
      setError('Error al registrar usuario')
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select value={rol} onChange={e => setRol(e.target.value)}>
        <option value="alumno">Alumno</option>
        <option value="maestro">Maestro</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Registrar</button>
      <p>
        ¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a>
      </p>
    </form>
  )
}

