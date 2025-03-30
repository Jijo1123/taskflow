"use client"

import { createContext, useState, useEffect } from "react"
import { loginUser, registerUser, getCurrentUser } from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem("token")
        }
      }

      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    const { token, user } = await loginUser(email, password)
    localStorage.setItem("token", token)
    setUser(user)
    setIsAuthenticated(true)
    return user
  }

  const register = async (firstName, lastName, email, password) => {
    const { token, user } = await registerUser(firstName, lastName, email, password)
    localStorage.setItem("token", token)
    setUser(user)
    setIsAuthenticated(true)
    return user
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

