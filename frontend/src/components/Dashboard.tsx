"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Buildings } from "./Buildings"
import { Bookings } from "./Bookings"
import { AdminPanel } from "./AdminPanel"

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("buildings")

  const tabs = [
    { id: "buildings", label: "Здания и аудитории", icon: "🏢" },
    { id: "bookings", label: "Мои бронирования", icon: "📅" },
    ...(user?.role === "admin" ? [{ id: "admin", label: "Администрирование", icon: "⚙️" }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Система бронирования аудиторий</h1>
              <p className="text-purple-100 mt-1">
                Добро пожаловать, {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <div className="font-medium">{user?.username}</div>
                <div className="text-sm text-purple-200 capitalize">{user?.role}</div>
              </div>
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "buildings" && <Buildings />}
        {activeTab === "bookings" && <Bookings />}
        {activeTab === "admin" && user?.role === "admin" && <AdminPanel />}
      </main>
    </div>
  )
}
