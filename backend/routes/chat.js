const express = require("express")
const Chat = require("../models/Chat")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/chat/message
// @desc    Send a new message
// @access  Private
router.post("/message", protect, async (req, res) => {
  try {
    const { content } = req.body
    const userId = req.user._id

    let chat = await Chat.findOne({ user: userId })

    if (!chat) {
      chat = new Chat({
        user: userId,
        messages: [],
      })
    }

    chat.messages.push({
      sender: userId,
      content,
    })

    chat.lastUpdated = Date.now()
    await chat.save()

    // Emit socket event
    const io = req.app.get("io")
    io.to("admin").emit("newMessage", {
      chatId: chat._id,
      userId,
      message: content,
      timestamp: new Date(),
    })

    res.status(201).json(chat)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/chat/admin/message
// @desc    Admin sends a message to a user
// @access  Private/Admin
router.post("/admin/message", protect, admin, async (req, res) => {
  try {
    const { chatId, content } = req.body
    const adminId = req.user._id

    const chat = await Chat.findById(chatId)

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    chat.messages.push({
      sender: adminId,
      content,
    })

    chat.lastUpdated = Date.now()
    await chat.save()

    // Emit socket event
    const io = req.app.get("io")
    io.to(chat.user.toString()).emit("newMessage", {
      chatId: chat._id,
      userId: adminId,
      message: content,
      isAdmin: true,
      timestamp: new Date(),
    })

    res.status(201).json(chat)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/chat/me
// @desc    Get user's chat history
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id }).populate("messages.sender", "firstName lastName role")

    if (!chat) {
      return res.json({ messages: [] })
    }

    res.json(chat)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/chat/admin/chats
// @desc    Get all active chats for admin
// @access  Private/Admin
router.get("/admin/chats", protect, admin, async (req, res) => {
  try {
    const chats = await Chat.find({ isActive: true })
      .populate("user", "firstName lastName email")
      .populate("messages.sender", "firstName lastName role")
      .sort({ lastUpdated: -1 })

    res.json(chats)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

