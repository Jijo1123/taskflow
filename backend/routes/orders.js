const express = require("express")
const Order = require("../models/Order")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body

    if (items && items.length === 0) {
      return res.status(400).json({ message: "No order items" })
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    })

    const createdOrder = await order.save()

    // Emit socket event for new order
    const io = req.app.get("io")
    io.to("admin").emit("newOrderNotification", {
      orderId: createdOrder._id,
      userId: req.user._id,
      totalAmount,
      status: "pending",
    })

    res.status(201).json(createdOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/orders/me
// @desc    Get logged in user orders
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName lastName email")

    if (order) {
      // Check if the order belongs to the logged in user or if user is admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === "admin") {
        res.json(order)
      } else {
        res.status(403).json({ message: "Not authorized to access this order" })
      }
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }

      const updatedOrder = await order.save()

      // Emit socket event for order update
      const io = req.app.get("io")
      io.to(order.user.toString()).emit("orderStatusUpdate", {
        orderId: order._id,
        status: "paid",
      })
      io.to("admin").emit("orderUpdate", {
        orderId: order._id,
        status: "paid",
        userId: order.user,
      })

      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      order.status = "delivered"

      const updatedOrder = await order.save()

      // Emit socket event for order update
      const io = req.app.get("io")
      io.to(order.user.toString()).emit("orderStatusUpdate", {
        orderId: order._id,
        status: "delivered",
      })

      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (order) {
      order.status = status

      // If status is delivered, update delivered fields
      if (status === "delivered") {
        order.isDelivered = true
        order.deliveredAt = Date.now()
      }

      const updatedOrder = await order.save()

      // Emit socket event for order update
      const io = req.app.get("io")
      io.to(order.user.toString()).emit("orderStatusUpdate", {
        orderId: order._id,
        status,
      })

      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "firstName lastName email").sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

