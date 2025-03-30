const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const socketIo = require("socket.io")
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const userRoutes = require("./routes/users")
const reviewRoutes = require("./routes/reviews")
const chatRoutes = require("./routes/chat")

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id)

  // Join a room based on user ID
  socket.on("join", (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  // Join admin room
  socket.on("joinAdmin", () => {
    socket.join("admin")
    console.log("Admin joined admin room")
  })

  // Handle chat messages
  socket.on("sendMessage", (data) => {
    const { room, message, sender } = data
    io.to(room).emit("message", { message, sender })
  })

  // Handle order updates
  socket.on("orderUpdate", (data) => {
    const { userId, orderId, status } = data
    io.to(userId).emit("orderStatusUpdate", { orderId, status })
    io.to("admin").emit("newOrderUpdate", { orderId, status, userId })
  })

  // Handle new order notification
  socket.on("newOrder", (data) => {
    io.to("admin").emit("newOrderNotification", data)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

// Make io accessible to routes
app.set("io", io)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/chat", chatRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

