import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { gameService } from '../services/gameService'
import { cartService } from '../services/cartService'
import toast from 'react-hot-toast'

const IMG_FALLBACK = 'https://placehold.co/300x180/111720/5a7090?text=Game'

function GameCard({ game, onAddToCart }) {
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    try {
      await onAddToCart(game)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', paddingTop: '60%', background: 'var(--surface)', overflow: 'hidden' }}>
        <img
          src={game.cover_image || IMG_FALLBACK}
          alt={game.title}
          onError={(e) => { e.target.src = IMG_FALLBACK }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{game.title}</div>
        {game.description && (
          <div style={{
            fontSize: '0.8rem', color: 'var(--text-muted)',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            flex: 1,
          }}>
            {game.description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700, fontSize: '1rem' }}>
            {game.price != null ? `$${parseFloat(game.price).toFixed(2)}` : 'Free'}
          </span>
          <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={adding}>
            {adding ? '...' : '🛒 Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  const { token } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    gameService.getAll()
      .then(setGames)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = async (game) => {
    if (!token) { toast.error('Please login to add items'); return }
    try {
      await cartService.addItem(token, { game_id: game.id })
      toast.success(`${game.title} added to cart!`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = games.filter((g) =>
    g.title?.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading store...</span>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div
        className="page-header"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
      >
        <div>
          <h1 className="page-title">Game <span>Store</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: 4 }}>
            {filtered.length} title{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <input
          className="form-input"
          style={{ maxWidth: 260 }}
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎮</div>
          <h3>No games found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}
