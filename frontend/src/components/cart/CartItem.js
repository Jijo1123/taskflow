"use client"

import { useContext } from "react"
import { CartContext } from "../../context/CartContext"
import "./CartItem.css"

const CartItem = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useContext(CartContext)

  return (
    <div className="cart-item">
      <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-control">
          <button
            className="quantity-btn"
            onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button className="quantity-btn" onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}>
            +
          </button>
        </div>
        <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem

