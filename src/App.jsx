import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Header from './components/Header'
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Shop from './pages/Shop'
import About from './pages/About'
import MyProfile from './pages/MyProfile'
import OtherProfile from './pages/OtherProfile'
import EditProfile from './pages/EditProfile'
import ProfilesList from './pages/ProfilesList'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'

function NotFound() {
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
        PAGE NOT FOUND
      </h2>
      <p className="error-message">The page you're looking for doesn't exist.</p>
    </div>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <span className="loading-text">Initializing...</span>
      </div>
    )
  }

  return (
    <>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:id" element={<OtherProfile />} />
        <Route path="/profiles" element={<ProfilesList />} />

        {/* Semi-public: shop visible to all, add-to-cart requires login */}
        <Route path="/" element={<Shop />} />

        {/* Private */}
        <Route
          path="/my-profile"
          element={<PrivateRoute><MyProfile /></PrivateRoute>}
        />

        <Route
          path="/edit-profile"
          element={<PrivateRoute><EditProfile /></PrivateRoute>}
        />
        
        <Route
          path="/cart"
          element={<PrivateRoute><Cart /></PrivateRoute>}
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
