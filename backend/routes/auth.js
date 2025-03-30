const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { protect } = require("../middleware/auth")

const router = express.Router()

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    })

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      })
    } else {
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", protect, async (req, res) => {
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

module.exports = router

