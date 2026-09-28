import React from 'react'
import LoginCard from './components/LoginCard'
import RegisterCard from './components/RegisterCard'
import LandingPage from './components/LandingPage';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/login" element={<LoginCard />} />
      <Route path="/register" element={<RegisterCard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />

      {/* ===== ADMIN ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
    // <div>
    //   <LoginCard/>
    //   <RegisterCard/>
    // </div>
  )
}

export default App
