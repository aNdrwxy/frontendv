import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b24',
              color: '#dce8f5',
              border: '1px solid #1a2235',
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.85rem',
            },
            success: {
              iconTheme: { primary: '#00e5ff', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#ff3d5a', secondary: '#000' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
