import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(() => localStorage.getItem('role'))
  const [loading, setLoading] = useState(!!localStorage.getItem('token'))

  const fetchProfile = useCallback(async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/profile/me/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Unauthorized')
      const data = await res.json()
      setUser(data)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) fetchProfile(token)
    else setLoading(false)
  }, [token, fetchProfile])

  const login = (data) => {
    localStorage.setItem('token', data.access)
    localStorage.setItem('role', data.role)

    setToken(data.access)
    setRole(data.role)

    fetchProfile(data.access)
  }

  const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')

  setToken(null)
  setUser(null)
  setRole(null)
}

  const refreshUser = () => token && fetchProfile(token)

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
