const BASE = 'http://localhost:8000/api'

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const profileService = {
  getMe: async (token) => {
    const res = await fetch(`${BASE}/profile/me/`, { headers: authHeaders(token) })
    if (!res.ok) throw new Error('Failed to fetch profile')
    return res.json()
  },

  getOther: async (id) => {
    const res = await fetch(`${BASE}/profile/other/${id}/`)
    if (!res.ok) throw new Error('Profile not found')
    return res.json()
  },

  getAll: async () => {
    const res = await fetch(`${BASE}/profile/all/`)
    if (!res.ok) throw new Error('Failed to fetch profiles')
    return res.json()
  },

  updateMe: async (token, data) => {
    const res = await fetch(`${BASE}/profile/me/update/`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.detail ?? 'Update failed')
    }
    return res.json()
  },
}
