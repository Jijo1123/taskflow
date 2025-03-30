"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { getUserOrders } from "../services/api"
import { SocketContext } from "../context/SocketContext"
import "./OrderHistory.css"

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders()
        setOrders(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch orders")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    if (socket) {
      // Listen for order status updates
      socket.on("orderStatusUpdate", ({ orderId, status }) => {
        setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status } : order)))
      })

      return () => {
        socket.off("orderStatusUpdate")
      }
    }
  }, [socket])

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "status-delivered"
      case "shipped":
        return "status-shipped"
      case "processing":
        return "status-processing"
      case "cancelled":
        return "status-cancelled"
      default:
        return "status-pending"
    }
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-page">
        <h1>Order History</h1>
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="order-history-page">
      <h1>Order History</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.substring(order._id.length - 8)}</h3>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            <div className="order-items">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="order-item-preview">
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <p className="item-name">{item.product.name}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && <div className="more-items">+{order.items.length - 3} more items</div>}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <Link to={`/order/${order._id}`} className="btn btn-secondary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory

