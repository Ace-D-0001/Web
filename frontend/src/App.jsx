import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Team from './pages/Team'
import Contact from './pages/Contact'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOTP from './pages/VerifyOTP'
import SetPassword from './pages/SetPassword'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import UserOrders from './pages/UserOrders'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
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

  if (loading) {
    return <div className="admin-loading">Initializing SynergyStack...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Default Landing - Always redirect to login path */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Entry Point - Handles both login and logged-in redirection */}
        <Route path="/login" element={
          !user ? <Login /> : (user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/home" replace />)
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Website Routes */}
        <Route element={<ProtectedRoute><Navbar /><main style={{ minHeight: '100vh', paddingTop: '80px' }}><Outlet /></main><Footer /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/team-members" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<UserOrders />} />
        </Route>
        
        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Catch-all Fallback */}
        <Route path="*" element={
          <Navigate to={!user ? "/login" : (user.role === 'admin' ? "/admin/dashboard" : "/home")} replace />
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
