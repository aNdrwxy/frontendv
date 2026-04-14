import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Authenticating...</span>
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />
  return children
}

export function AdminRoute({ children }) {
  const { token, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Verifying permissions...</span>
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />

  if (role !== 'admin') {
    return (
      <div className="error-page">
        <div className="error-code">403</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
          ACCESS DENIED
        </h2>
        <p className="error-message">You don't have permission to view this page.</p>
      </div>
    )
  }

  return children
}
