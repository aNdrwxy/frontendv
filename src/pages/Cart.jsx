import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { cartService } from '../services/cartService'
import toast from 'react-hot-toast'

const IMG_FALLBACK = 'https://placehold.co/80x60/111720/5a7090?text=Game'

export default function Cart() {
  const { token } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  const fetchCart = () => {
    cartService.getCart(token)
      .then(setCart)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [token])

  const handleRemove = async (gameId) => {
    try {
      await cartService.removeItem(token, gameId)
      toast.success('Item removed')
      fetchCart()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)

    const loadingToast = toast.loading('Preparing payment...')

    try {
      const data = await cartService.checkout(token)

      const orderId = data.id

      const interval = setInterval(async () => {
        try {
          const payment = await cartService.getPayment(orderId)

          if (!payment) return

          if (payment.approval_url) {
            clearInterval(interval)

            toast.dismiss(loadingToast)
            toast.success('Redirecting to PayPal...')

            window.location.href = payment.approval_url
          }

        } catch (err) {
          console.error(err)
        }
      }, 2000)

    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error(err.message)
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading cart...</span>
      </div>
    )
  }

  const items = cart?.items ?? []
  const total = items.reduce((sum, item) => sum + parseFloat(item.price ?? 0), 0)

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">My <span>Cart</span></h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Browse the shop and add some games!</p>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items */}
          <div>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  className="cart-item-img"
                  src={item.cover_image || IMG_FALLBACK}
                  alt={item.title}
                  onError={(e) => { e.target.src = IMG_FALLBACK }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.title ?? 'Unknown Game'}</div>
                  <div className="cart-item-price">${parseFloat(item.price ?? 0).toFixed(2)}</div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(item.game_id) }
                >
                  🗑 Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary-title">Order Summary</div>
            {items.map((item) => (
              <div className="cart-summary-row" key={item.id}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                  {item.title}
                </span>
                <span>${parseFloat(item.price ?? 0).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing...' : '💳 Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
