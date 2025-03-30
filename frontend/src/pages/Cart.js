"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import CartItem from "../components/cart/CartItem"
import "./Cart.css"

const Cart = () => {
  const { cart } = useContext(CartContext)

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${calculateTotal()}</span>
          </div>
          <div className="summary-item">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary checkout-btn">
            Proceed to Checkout
          </Link>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart

