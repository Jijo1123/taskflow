const express = require("express")
const Product = require("../models/Product")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/products
// @desc    Get all products with filtering
// @access  Public
router.get("/", async (req, res) => {
  try {
    const pageSize = 10
    const page = Number(req.query.page) || 1

    // Build filter object
    const filter = {}

    if (req.query.category) {
      filter.category = req.query.category
    }

    if (req.query.keyword) {
      filter.name = {
        $regex: req.query.keyword,
        $options: "i",
      }
    }

    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      }
    } else if (req.query.minPrice) {
      filter.price = { $gte: Number(req.query.minPrice) }
    } else if (req.query.maxPrice) {
      filter.price = { $lte: Number(req.query.maxPrice) }
    }

    // Rating filter
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) }
    }

    // Count total products with filter
    const count = await Product.countDocuments(filter)

    // Get products with pagination
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(req.query.sort ? { [req.query.sort]: req.query.order === "desc" ? -1 : 1 } : { createdAt: -1 })

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/products/categories
// @desc    Get all product categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category")
    res.json(categories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/products/:id/related
// @desc    Get related products
// @access  Public
router.get("/:id/related", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: req.params.id },
      category: product.category,
    }).limit(4)

    res.json(relatedProducts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description, price, image, category, countInStock } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      countInStock,
      user: req.user._id,
    })

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, description, price, image, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      product.name = name || product.name
      product.description = description || product.description
      product.price = price || product.price
      product.image = image || product.image
      product.category = category || product.category
      product.countInStock = countInStock || product.countInStock

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      await product.remove()
      res.json({ message: "Product removed" })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

