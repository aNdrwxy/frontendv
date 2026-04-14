import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Dropdown from './Dropdown'

const AVATAR_FALLBACK = 'https://api.dicebear.com/8.x/identicon/svg?seed=user'

export default function Header() {
  const { token, user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">⚡ GameStore</Link>

        {/* Nav */}
        <nav className="header-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Shop
          </NavLink>
          <NavLink
            to="/profiles"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Profiles
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            About
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="header-right">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                className={`user-chip${open ? ' open' : ''}`}
                onClick={() => setOpen((v) => !v)}
              >
                <div className="user-chip-avatar">
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
                <span className="user-chip-name">{user?.nickname ?? '...'}</span>
                <span className="user-chip-arrow">▼</span>
              </div>
              {open && <Dropdown onClose={() => setOpen(false)} />}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
