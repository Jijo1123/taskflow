"use client"

import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return isAuthenticated && user && user.role === "admin" ? <Outlet /> : <Navigate to="/login" />
}

export default AdminRoute

