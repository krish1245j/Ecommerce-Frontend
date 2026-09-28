import axiosInstance from "../../api/axiosInstance";

// All admin routes require auth (verifyJwt) + role "admin" (isAdmin) on the
// backend — axiosInstance already attaches the access token and silently
// refreshes it on a 401 (see api/axiosInstance.js).

/* ==================== DASHBOARD ==================== */

export const getDashboard = () => axiosInstance.get("/admin/dashboard");

/* ==================== ORDERS ==================== */

export const getOrders = (page = 1, limit = 10) =>
  axiosInstance.get("/admin/orders", { params: { page, limit } });

export const getOrderById = (id) => axiosInstance.get(`/admin/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  axiosInstance.patch(`/admin/orders/${id}/status`, { status });

/* ==================== PRODUCTS ==================== */
// Note: unlike orders/users, the products endpoint is cursor-paginated
// (limit + cursor), matching the public product listing route.

export const getAdminProducts = (params = {}) =>
  axiosInstance.get("/admin/products", { params });

export const createProduct = (formData) =>
  axiosInstance.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, formData) =>
  axiosInstance.patch(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) => axiosInstance.delete(`/admin/products/${id}`);

/* ==================== USERS ==================== */

export const getUsers = (page = 1, limit = 10) =>
  axiosInstance.get("/admin/users", { params: { page, limit } });

export const changeUserStatus = (id, isBlocked) =>
  axiosInstance.patch(`/admin/users/${id}/status`, { isBlocked });
