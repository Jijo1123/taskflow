import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import OrderHistory from "./pages/OrderHistory"
import OrderDetails from "./pages/OrderDetails"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminProducts from "./pages/admin/Products"
import AdminOrders from "./pages/admin/Orders"
import AdminUsers from "./pages/admin/Users"
import AdminProductEdit from "./pages/admin/ProductEdit"
import Chat from "./pages/Chat"
import AdminChat from "./pages/admin/Chat"
import PrivateRoute from "./components/routing/PrivateRoute"
import AdminRoute from "./components/routing/AdminRoute"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search/:keyword" element={<Home />} />
                  <Route path="/category/:category" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/chat" element={<Chat />} />

                  {/* Private Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/order/:id" element={<OrderDetails />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/product/:id/edit" element={<AdminProductEdit />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/chat" element={<AdminChat />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App

