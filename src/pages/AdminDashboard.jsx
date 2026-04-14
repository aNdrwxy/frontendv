import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { gameService } from '../services/gameService'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  cover_image: ''
}

const IMG_FALLBACK = 'https://placehold.co/48x34/111720/5a7090?text=?'

function GameModal({ game, onClose, onSave }) {
  const [form, setForm] = useState(game ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price)
      }
      await onSave(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{game ? '✏️ Edit Game' : '➕ New Game'}</div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {[
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'price', label: 'Price ($)', type: 'number' },
            { name: 'cover_image', label: 'Image URL', type: 'url' },
          ].map(({ name, label, type }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type={type}
                name={name}
                value={form[name] ?? ''}
                onChange={handleChange}
                required={name === 'title'}
              />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description"
              rows={3}
              value={form.description ?? ''}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-surface" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmModal({ game, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
        <div className="modal-title" style={{ textAlign: 'center' }}>Delete Game</div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 8 }}>
          Are you sure you want to delete
        </p>

        <p style={{ fontWeight: 700, color: 'var(--red)', marginBottom: 24 }}>
          {game.title}
        </p>

        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-surface" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { token } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const fetchGames = () => {
    gameService.getAll(token)
      .then(setGames)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchGames()
  }, [token])

  const handleCreate = async (form) => {
    try {
      await gameService.create(token, form)
      toast.success('Game created!')
      setModal(null)
      fetchGames()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = async (form) => {
    try {
      await gameService.update(token, modal.game.id, form)
      toast.success('Game updated!')
      setModal(null)
      fetchGames()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      await gameService.delete(token, modal.game.id)
      toast.success('Game deleted')
      setModal(null)
      fetchGames()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading games...</span>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin <span>Dashboard</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: 4 }}>
            {games.length} game{games.length !== 1 ? 's' : ''} in catalog
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setModal({ type: 'create' })}>
          ➕ Add Game
        </button>
      </div>

      {games.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎮</div>
          <h3>No games yet</h3>
          <p>Add your first game to the catalog.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="games-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td>
                    <img
                      className="game-thumb"
                      src={game.cover_image || IMG_FALLBACK}
                      alt={game.title}
                      onError={(e) => { e.target.src = IMG_FALLBACK }}
                    />
                  </td>

                  <td style={{ fontWeight: 600 }}>{game.title}</td>

                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                    {game.price != null ? `$${parseFloat(game.price).toFixed(2)}` : '—'}
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setModal({ type: 'edit', game })}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setModal({ type: 'delete', game })}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === 'create' && (
        <GameModal onClose={() => setModal(null)} onSave={handleCreate} />
      )}

      {modal?.type === 'edit' && (
        <GameModal game={modal.game} onClose={() => setModal(null)} onSave={handleEdit} />
      )}

      {modal?.type === 'delete' && (
        <ConfirmModal game={modal.game} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  )
}