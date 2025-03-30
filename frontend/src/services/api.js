const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Helper function to handle fetch requests
const fetchData = async (url, options = {}) => {
  // Get the token from localStorage
  const token = localStorage.getItem("token")

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    })

    // Parse the JSON response
    const data = await response.json()

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Auth API calls
export const registerUser = async (firstName, lastName, email, password) => {
  return fetchData("/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, password }),
  })
}

export const loginUser = async (email, password) => {
  return fetchData("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export const getCurrentUser = async () => {
  return fetchData("/auth/me")
}

// User API calls
export const getUserProfile = async () => {
  return fetchData("/users/profile")
}

export const updateUserProfile = async (userData) => {
  return fetchData("/users/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

export const getUserOrders = async () => {
  return fetchData("/users/orders")
}

export const getAllUsers = async () => {
  return fetchData("/users")
}

export const getUserById = async (id) => {
  return fetchData(`/users/${id}`)
}

export const updateUser = async (id, userData) => {
  return fetchData(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

export const deleteUser = async (id) => {
  return fetchData(`/users/${id}`, {
    method: "DELETE",
  })
}

// Products API calls
export const getProducts = async (params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.keyword) queryParams.append("keyword", params.keyword)
  if (params.category) queryParams.append("category", params.category)
  if (params.minPrice) queryParams.append("minPrice", params.minPrice)
  if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice)
  if (params.rating) queryParams.append("rating", params.rating)
  if (params.page) queryParams.append("page", params.page)
  if (params.sort) queryParams.append("sort", params.sort)
  if (params.order) queryParams.append("order", params.order)

  const queryString = queryParams.toString()

  return fetchData(`/products${queryString ? `?${queryString}` : ""}`)
}

export const getProductById = async (id) => {
  return fetchData(`/products/${id}`)
}

export const getRelatedProducts = async (id) => {
  return fetchData(`/products/${id}/related`)
}

export const getProductCategories = async () => {
  return fetchData("/products/categories")
}

export const createProduct = async (productData) => {
  return fetchData("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

export const updateProduct = async (id, productData) => {
  return fetchData(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  })
}

export const deleteProduct = async (id) => {
  return fetchData(`/products/${id}`, {
    method: "DELETE",
  })
}

// Reviews API calls
export const getProductReviews = async (productId) => {
  return fetchData(`/reviews/product/${productId}`)
}

export const createReview = async (reviewData) => {
  return fetchData("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  })
}

export const getUserReviews = async () => {
  return fetchData("/reviews/user")
}

export const updateReview = async (id, reviewData) => {
  return fetchData(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  })
}

export const deleteReview = async (id) => {
  return fetchData(`/reviews/${id}`, {
    method: "DELETE",
  })
}

// Orders API calls
export const createOrder = async (orderData) => {
  return fetchData("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  })
}

export const getOrderById = async (id) => {
  return fetchData(`/orders/${id}`)
}

export const updateOrderToPaid = async (id, paymentResult) => {
  return fetchData(`/orders/${id}/pay`, {
    method: "PUT",
    body: JSON.stringify(paymentResult),
  })
}

export const getAllOrders = async () => {
  return fetchData("/orders")
}

export const updateOrderStatus = async (id, status) => {
  return fetchData(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export const updateOrderToDelivered = async (id) => {
  return fetchData(`/orders/${id}/deliver`, {
    method: "PUT",
  })
}

// Chat API calls
export const getChatHistory = async () => {
  return fetchData("/chat/me")
}

export const sendMessage = async (content) => {
  return fetchData("/chat/message", {
    method: "POST",
    body: JSON.stringify({ content }),
  })
}

export const getAdminChats = async () => {
  return fetchData("/chat/admin/chats")
}

export const sendAdminMessage = async (chatId, content) => {
  return fetchData("/chat/admin/message", {
    method: "POST",
    body: JSON.stringify({ chatId, content }),
  })
}

// Admin API calls
export const getAdminStats = async () => {
  return fetchData("/admin/stats")
}

