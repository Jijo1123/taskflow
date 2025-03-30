const express = require("express")
const User = require("../models/User")
const Order = require("../models/Order")
const { protect, admin } = require("../middleware/auth")
const bcrypt = require("bcryptjs")

const router = express.Router()

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.firstName = req.body.firstName || user.firstName
      user.lastName = req.body.lastName || user.lastName
      user.email = req.body.email || user.email

      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/orders
// @desc    Get user orders
// @access  Private
router.get("/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password")
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      user.firstName = req.body.firstName || user.firstName
      user.lastName = req.body.lastName || user.lastName
      user.email = req.body.email || user.email
      user.role = req.body.role || user.role

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      // Don't allow admin to delete themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "Cannot delete your own account" })
      }

      await user.remove()
      res.json({ message: "User removed" })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

