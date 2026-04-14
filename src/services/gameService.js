const BASE = 'http://localhost:8001/api'

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const gameService = {
  getAll: async () => {
    const res = await fetch(`${BASE}/games/`)
    if (!res.ok) throw new Error('Failed to fetch games')
    return res.json()
  },

  create: async (token, data) => {
    const res = await fetch(`${BASE}/games/`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.detail ?? 'Create failed')
    }
    return res.json()
  },

  update: async (token, id, data) => {
    const res = await fetch(`${BASE}/games/${id}/`, {
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

  delete: async (token, id) => {
    const res = await fetch(`${BASE}/games/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
    if (!res.ok) throw new Error('Delete failed')
  },
}
