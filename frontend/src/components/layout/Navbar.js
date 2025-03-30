"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { CartContext } from "../../context/CartContext"
import "./Navbar.css"

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ShopMERN
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link">
              Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          </li>
          {isAuthenticated ? (
            <li className="nav-item">
              <button onClick={logout} className="nav-link btn-link">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

