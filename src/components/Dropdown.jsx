import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AVATAR_FALLBACK = 'https://api.dicebear.com/8.x/identicon/svg?seed=user'

export default function Dropdown({ onClose }) {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const item = (icon, label, to, danger = false) => (
    <Link
      to={to}
      className={`dropdown-item${danger ? ' danger' : ''}`}
      onClick={onClose}
    >
      <span className="dropdown-item-icon">{icon}</span>
      {label}
    </Link>
  )

  return (
    <div className="dropdown" ref={ref}>
      <div className="dropdown-header">
        <div className="dropdown-header-avatar">
          <img
            className="avatar-img"
            src={user?.avatar || AVATAR_FALLBACK}
            alt={user?.nickname}
            onError={(e) => { e.target.src = AVATAR_FALLBACK }}
          />
          {user?.frame && (
            <img className="frame-img" src={user.frame} alt="" />
          )}
        </div>
        <div className="dropdown-header-info">
          <div className="dropdown-header-nick">{user?.nickname ?? '—'}</div>
          <div className="dropdown-header-level">LVL {user?.level ?? '?'}</div>
        </div>
      </div>

      <div className="dropdown-menu">
        {item('👤', 'My Profile', '/my-profile')}
        {item('✏️', 'Edit Profile', '/edit-profile')}
        {item('🛒', 'Cart', '/cart')}
        {role === 'admin' && item('⚙️', 'Admin Dashboard', '/admin/dashboard')}
        <div className="dropdown-divider" />
        <button className="dropdown-item danger" onClick={handleLogout}>
          <span className="dropdown-item-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  )
}
