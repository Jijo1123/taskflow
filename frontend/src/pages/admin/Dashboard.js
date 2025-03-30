"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { SocketContext } from "../../context/SocketContext"
import { getAdminStats } from "../../services/api"
import AdminSidebar from "../../components/admin/AdminSidebar"
import "./Admin.css"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats()
        setStats(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load dashboard data")
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("newOrderNotification", (data) => {
        setNotifications((prev) =>
          [
            {
              id: Date.now(),
              type: "order",
              message: `New order #${data.orderId.substring(data.orderId.length - 8)} for $${data.totalAmount.toFixed(2)}`,
              time: new Date(),
            },
            ...prev,
          ].slice(0, 5),
        )

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          totalSales: prev.totalSales + data.totalAmount,
          recentOrders: [
            {
              _id: data.orderId,
              user: { _id: data.userId },
              totalAmount: data.totalAmount,
              status: "pending",
              createdAt: new Date(),
            },
            ...prev.recentOrders,
          ].slice(0, 5),
        }))
      })

      socket.on("newMessage", (data) => {
        setNotifications((prev) =>
          [
            {
              id: Date.now(),
              type: "message",
              message: `New message from user`,
              time: new Date(),
            },
            ...prev,
          ].slice(0, 5),
        )
      })

      return () => {
        socket.off("newOrderNotification")
        socket.off("newMessage")
      }
    }
  }, [socket])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <div className="admin-notifications">
            <div className="notification-icon">
              <span className="notification-badge">{notifications.length}</span>
              <i className="notification-bell">🔔</i>
            </div>
            {notifications.length > 0 && (
              <div className="notification-dropdown">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p>{notification.message}</p>
                    <span className="notification-time">{new Date(notification.time).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon sales-icon">💰</div>
            <div className="stat-content">
              <h3>Total Sales</h3>
              <p className="stat-value">${stats.totalSales.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders-icon">📦</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products-icon">🛒</div>
            <div className="stat-content">
              <h3>Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-content">
              <h3>Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="view-all">
                View All
              </Link>
            </div>
            <div className="section-content">
              {stats.recentOrders.length === 0 ? (
                <p className="empty-message">No recent orders</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.substring(order._id.length - 8)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/orders/${order._id}`} className="action-link">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Low Stock Products</h2>
              <Link to="/admin/products" className="view-all">
                View All
              </Link>
            </div>
            <div className="section-content">
              {stats.lowStockProducts.length === 0 ? (
                <p className="empty-message">No low stock products</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="product-cell">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                          <span>{product.name}</span>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td className="stock-cell">
                          <span className="low-stock">{product.countInStock}</span>
                        </td>
                        <td>
                          <Link to={`/admin/product/${product._id}/edit`} className="action-link">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

