"use client"

import type React from "react"
import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { Dashboard } from "./components/Dashboard"

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  return <Dashboard />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
