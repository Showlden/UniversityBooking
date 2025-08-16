"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, apiClient } from "../utils/api"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const clearTokens = () => {
    console.log("Clearing all tokens")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  useEffect(() => {
    // Проверяем, есть ли сохраненные данные пользователя
    const token = localStorage.getItem("access_token")
    const savedUserData = localStorage.getItem("user_data")

    console.log("AuthContext useEffect:", {
      hasToken: !!token,
      hasUserData: !!savedUserData,
    })

    if (token && savedUserData) {
      try {
        const userData = JSON.parse(savedUserData)
        console.log("Restored user from localStorage:", userData)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        clearTokens()
      }
    }

    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await apiClient.login(username, password)

    // Сохраняем токены и данные пользователя
    localStorage.setItem("access_token", response.access)
    localStorage.setItem("refresh_token", response.refresh)
    localStorage.setItem("user_data", JSON.stringify(response.user))

    setUser(response.user)
  }

  const logout = () => {
    clearTokens()
  }

  const register = async (userData: any) => {
    await apiClient.register(userData)
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
