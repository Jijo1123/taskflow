const express = require("express")
const Review = require("../models/Review")
const Product = require("../models/Product")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { rating, comment, title, productId } = req.body

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    })

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" })
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      title,
    })

    await review.save()

    // Update product rating
    const product = await Product.findById(productId)
    const reviews = await Review.find({ product: productId })

    product.numReviews = reviews.length
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await product.save()

    res.status(201).json({ message: "Review added" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/reviews/product/:id
// @desc    Get all reviews for a product
// @access  Public
router.get("/product/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/reviews/user
// @desc    Get all reviews by the logged in user
// @access  Private
router.get("/user", protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate("product", "name image").sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { rating, comment, title } = req.body

    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    review.rating = Number(rating) || review.rating
    review.comment = comment || review.comment
    review.title = title || review.title

    await review.save()

    // Update product rating
    const product = await Product.findById(review.product)
    const reviews = await Review.find({ product: review.product })

    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await product.save()

    res.json({ message: "Review updated" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const productId = review.product

    await review.remove()

    // Update product rating
    const product = await Product.findById(productId)
    const reviews = await Review.find({ product: productId })

    if (reviews.length > 0) {
      product.numReviews = reviews.length
      product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    } else {
      product.numReviews = 0
      product.rating = 0
    }

    await product.save()

    res.json({ message: "Review removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

