"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../../context/CartContext"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
      </Link>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <button className="btn btn-primary add-to-cart-btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard

