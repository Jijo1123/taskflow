"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { createOrder } from "../services/api"
import "./Checkout.css"

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useContext(CartContext)
  const { user, isAuthenticated } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "credit_card",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setError("You must be logged in to complete checkout")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: Number.parseFloat(calculateTotal()),
      }

      await createOrder(orderData)
      clearCart()
      navigate("/order-success")
    } catch (err) {
      setError("Failed to process your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Shipping Information</h2>
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
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>
            <div className="form-group">
              <div className="radio-group">
                <input
                  type="radio"
                  id="credit_card"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === "credit_card"}
                  onChange={handleChange}
                />
                <label htmlFor="credit_card">Credit Card</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="mpesa"
                  name="paymentMethod"
                  value="mpesa"
                  checked={formData.paymentMethod === "mpesa"}
                  onChange={handleChange}
                />
                <label htmlFor="mpesa">M-Pesa</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.map((item) => (
              <div key={item._id} className="order-item">
                <div className="order-item-details">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="order-item-image" />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="order-item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

