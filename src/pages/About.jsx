import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🎮', title: 'Massive Catalog', desc: 'Thousands of games across every genre and platform. From indie gems to AAA blockbusters.' },
  { icon: '⚡', title: 'Instant Delivery', desc: 'Keys delivered instantly to your account the moment your payment clears.' },
  { icon: '🛡️', title: 'Secure Payments', desc: 'Military-grade encryption and multiple payment methods keep your data safe.' },
  { icon: '👥', title: 'Community', desc: 'Connect with other gamers, share profiles and discover what others are playing.' },
  { icon: '🏆', title: 'Reward System', desc: 'Level up your account with every purchase and unlock exclusive frames and badges.' },
  { icon: '🌍', title: 'Global Reach', desc: 'Available in 190+ countries. Local pricing so gaming is accessible to everyone.' },
]

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="about-hero">
        <div className="about-logo">GameStore</div>
        <p className="about-tagline">
          The next-generation gaming marketplace. Buy, collect, and discover games
          while connecting with a global community of players.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">Browse Games</Link>
          <Link to="/profiles" className="btn btn-ghost btn-lg">Meet Players</Link>
        </div>
      </div>

      <div className="divider" />

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 className="page-title">Why <span>GameStore?</span></h2>
      </div>

      <div className="about-grid">
        {FEATURES.map(({ icon, title, desc }) => (
          <div className="about-feature-card" key={title}>
            <div className="about-feature-icon">{icon}</div>
            <div className="about-feature-title">{title}</div>
            <div className="about-feature-desc">{desc}</div>
          </div>
        ))}
      </div>

      <div className="divider" style={{ marginTop: 48 }} />

      <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
        <p>Built with ❤️ using React + Vite</p>
        <p style={{ marginTop: 8, color: 'var(--text-dim)' }}>© 2025 GameStore. All rights reserved.</p>
      </div>
    </div>
  )
}
