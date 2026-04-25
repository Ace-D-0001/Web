import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Team from './pages/Team'
import Contact from './pages/Contact'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function AppContent() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [dbStatus, setDbStatus] = useState('checking')

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`)
      setBackendStatus('online')
      setDbStatus(response.data.database ? 'online' : 'offline')
    } catch (error) {
      setBackendStatus('offline')
      setDbStatus('offline')
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Router>
      <Routes>
        {/* Auth Routes - Unprotected */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Website Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main style={{ minHeight: '100vh' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/team-members" element={<Team />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
