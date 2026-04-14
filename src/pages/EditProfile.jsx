import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import toast from 'react-hot-toast'

const FIELDS = [
  { name: 'nickname', label: 'Nickname', type: 'text' },
  { name: 'realName', label: 'Real Name', type: 'text' },
  { name: 'countrie', label: 'Country', type: 'text' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'gender', label: 'Gender', type: 'text' },
  { name: 'avatar', label: 'Avatar URL', type: 'url' },
  { name: 'frame', label: 'Frame URL', type: 'url' },
  { name: 'background', label: 'Background URL', type: 'url' },
]

export default function EditProfile() {
  const { token, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    profileService.getMe(token)
      .then((data) => setForm(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await profileService.updateMe(token, form)
      refreshUser()
      toast.success('Profile updated!')
      navigate('/my-profile')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading...</span>
      </div>
    )
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1 className="page-title">Edit <span>Profile</span></h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FIELDS.map(({ name, label, type }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type={type}
                name={name}
                value={form[name] ?? ''}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button
              type="button"
              className="btn btn-surface"
              onClick={() => navigate('/my-profile')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
