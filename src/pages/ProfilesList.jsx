import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import toast from 'react-hot-toast'

const AVATAR_FALLBACK = 'https://api.dicebear.com/8.x/identicon/svg?seed=user'

export default function ProfilesList() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    profileService.getAll(token)
      .then(setProfiles)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const filtered = profiles.filter((p) =>
    p.nickname?.toLowerCase().includes(search.toLowerCase()) ||
    p.realName?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading profiles...</span>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <h1 className="page-title">All <span>Profiles</span></h1>
        <input
          className="form-input"
          style={{ maxWidth: 280 }}
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No profiles found</h3>
          <p>Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="profile-card"
              onClick={() => navigate(`/profile/${p.id}`)}
            >
              <div className="profile-card-avatar">
                <img
                  className="avatar-img"
                  src={p.avatar || AVATAR_FALLBACK}
                  alt={p.nickname}
                  onError={(e) => { e.target.src = AVATAR_FALLBACK }}
                />
                {p.frame && <img className="frame-img" src={p.frame} alt="" />}
              </div>
              <div className="profile-card-nick">{p.nickname}</div>
              <div className="profile-card-level">LVL {p.level}</div>
              {p.countrie && (
                <span className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                  🌍 {p.countrie}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
