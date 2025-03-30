"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { getProductById } from "../services/api"
import "./ProductDetails.css"

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.")
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return <div className="loading">Loading product details...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  return (
    <div className="product-details">
      <div className="product-image-container">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-detail-image" />
      </div>
      <div className="product-info">
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-price">${product.price.toFixed(2)}</p>
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
        <button className="btn btn-primary add-to-cart-btn-large" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductDetails

