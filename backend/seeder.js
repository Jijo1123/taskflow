const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("./models/User")
const Product = require("./models/Product")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Sample users
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
]

// Sample products
const products = [
  {
    name: "Smartphone X",
    description: "Latest smartphone with advanced features and high-resolution camera.",
    price: 999.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    countInStock: 15,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: "Laptop Pro",
    description: "Powerful laptop for professionals with high performance and long battery life.",
    price: 1299.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    countInStock: 10,
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and crystal clear sound.",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    countInStock: 25,
    rating: 4.2,
    numReviews: 15,
  },
  {
    name: "Smart Watch",
    description: "Track your fitness and stay connected with this stylish smart watch.",
    price: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    countInStock: 18,
    rating: 4.0,
    numReviews: 7,
  },
  {
    name: "Casual T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear.",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Clothing",
    countInStock: 50,
    rating: 4.3,
    numReviews: 20,
  },
  {
    name: "Running Shoes",
    description: "Lightweight and durable running shoes for optimal performance.",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Footwear",
    countInStock: 30,
    rating: 4.6,
    numReviews: 18,
  },
]

// Import data to database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await Product.deleteMany()

    // Import users
    const createdUsers = await User.insertMany(users)
    console.log("Users imported!")

    // Import products
    await Product.insertMany(products)
    console.log("Products imported!")

    console.log("Data import completed!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Run the import
importData()

