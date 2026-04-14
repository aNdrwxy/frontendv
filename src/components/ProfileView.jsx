import { Link } from 'react-router-dom'

const AVATAR_FALLBACK = 'https://api.dicebear.com/8.x/identicon/svg?seed=user'

const STATE_BADGE = {
  active: 'badge-green',
  inactive: 'badge-muted',
  banned: 'badge-red',
}

export default function ProfileView({ profile, isOwn = false }) {
  if (!profile) return null

  const badgeClass = STATE_BADGE[profile.userState] ?? 'badge-muted'

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-bg">
          {profile.background && (
            <img src={profile.background} alt="" onError={(e) => { e.target.style.display = 'none' }} />
          )}
        </div>
        <div className="profile-hero-overlay" />
        <div className="profile-hero-content">
          <div className="profile-avatar-wrap">
            <img
              className="avatar-img"
              src={profile.avatar || AVATAR_FALLBACK}
              alt={profile.nickname}
              onError={(e) => { e.target.src = AVATAR_FALLBACK }}
            />
            {profile.frame && <img className="frame-img" src={profile.frame} alt="" />}
          </div>
          <div className="profile-info">
            <div className="profile-nickname">{profile.nickname}</div>
            <div className="profile-realname">{profile.realName}</div>
            <div className="profile-badges">
              <span className={`badge badge-accent`}>LVL {profile.level}</span>
              <span className={`badge ${badgeClass}`}>{profile.userState}</span>
              {profile.countrie && <span className="badge badge-muted">🌍 {profile.countrie}</span>}
              {profile.gender && <span className="badge badge-muted">{profile.gender}</span>}
            </div>
          </div>
          {isOwn && (
            <Link to="/edit-profile" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
              ✏️ Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        {[
          { label: 'Level', value: profile.level, accent: true },
          { label: 'Age', value: profile.age ?? '—' },
          { label: 'Country', value: profile.countrie ?? '—' },
          { label: 'Status', value: profile.userState ?? '—' },
          { label: 'Gender', value: profile.gender ?? '—' },
          { label: 'ID', value: profile.id?.slice(0, 8) ?? '—' },
        ].map(({ label, value, accent }) => (
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className={`stat-value${accent ? ' accent' : ''}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      {profile.description && (
        <div className="profile-desc-card">
          <div className="profile-desc-title">About</div>
          <div className="profile-desc-text">{profile.description}</div>
        </div>
      )}
    </div>
  )
}
