const BASE = 'http://localhost:8002/api'
const PAYMENT_BASE = 'http://localhost:8003/api'

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const cartService = {
  getCart: async (token) => {
    const res = await fetch(`${BASE}/cart/`, { headers: authHeaders(token) })
    if (!res.ok) throw new Error('Failed to fetch cart')
    return res.json()
  },

  addItem: async (token, data) => {
    const res = await fetch(`${BASE}/cart/add_item/`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add item')
    return res.json()
  },

  removeItem: async (token, gameId) => {
    const res = await fetch(`${BASE}/cart/remove_item/`, {
      method: 'DELETE',
      headers: authHeaders(token),
      body: JSON.stringify({ game_id: gameId }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error ?? 'Failed to remove item')
    }
  },

  checkout: async (token) => {
    const res = await fetch(`${BASE}/cart/checkout/`, {
      method: 'POST',
      headers: authHeaders(token),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.detail ?? 'Checkout failed')
    }

    return res.json()
  },

  getPayment: async (orderId) => {
    const res = await fetch(`${PAYMENT_BASE}/payments/${orderId}/`)

    if (!res.ok) return null

    return res.json()
  },
}