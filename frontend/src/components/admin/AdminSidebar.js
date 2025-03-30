import { Link, useLocation } from "react-router-dom"
import "./AdminSidebar.css"

const AdminSidebar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-nav">
        <ul>
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <Link to="/admin/dashboard">
              <i className="nav-icon">📊</i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive("/admin/products") ? "active" : ""}>
            <Link to="/admin/products">
              <i className="nav-icon">🛒</i>
              <span>Products</span>
            </Link>
          </li>
          <li className={isActive("/admin/orders") ? "active" : ""}>
            <Link to="/admin/orders">
              <i className="nav-icon">📦</i>
              <span>Orders</span>
            </Link>
          </li>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">
              <i className="nav-icon">👥</i>
              <span>Users</span>
            </Link>
          </li>
          <li className={isActive("/admin/chat") ? "active" : ""}>
            <Link to="/admin/chat">
              <i className="nav-icon">💬</i>
              <span>Customer Support</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <Link to="/" className="back-to-site">
          <i className="nav-icon">🏠</i>
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  )
}

export default AdminSidebar

