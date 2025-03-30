"use client"

import { useState, useEffect } from "react"
import ProductCard from "../components/products/ProductCard"
import "./Home.css"
import { getProducts } from "../services/api"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch products. Please try again later.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to ShopMERN</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      <h2 className="section-title">Featured Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Home

