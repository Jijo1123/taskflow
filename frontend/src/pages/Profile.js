"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { getUserProfile, updateUserProfile } from "../services/api"
import "./Profile.css"

const Profile = () => {
  const { user, setUser } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile()
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: "",
          confirmPassword: "",
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to load profile data")
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setUpdating(true)
      setError(null)

      // Only send password if it's provided
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const updatedUser = await updateUserProfile(updateData)
      setUser(updatedUser)
      setSuccess(true)

      // Clear password fields
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading profile...</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <h2>My Account</h2>
          <ul className="profile-menu">
            <li className="active">
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/orders">Order History</Link>
            </li>
            <li>
              <Link to="/chat">Customer Support</Link>
            </li>
          </ul>
        </div>

        <div className="profile-content">
          <h1>My Profile</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Profile updated successfully!</div>}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

