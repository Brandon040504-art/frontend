import { useNavigate, NavLink } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        <strong>Sistema Escolar</strong>
      </div>

      <div style={styles.menu}>
        <NavLink
          to="/dashboard-alumno"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Dashboard
        </NavLink>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#0077ff',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  link: {
    color: '#dbeafe',
    textDecoration: 'none',
    fontWeight: '600',
  },
  activeLink: {
    color: '#fff',
    borderBottom: '2px solid #fff',
    paddingBottom: '2px',
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#f87171',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
}
