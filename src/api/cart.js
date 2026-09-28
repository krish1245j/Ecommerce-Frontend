import axiosInstance from "./axiosInstance";

// All cart routes require auth (verifyJwt) — axiosInstance already attaches
// the access token and silently refreshes it on a 401 (see axiosInstance.js).

export const getCart = () => axiosInstance.get("/cart/items");

export const addToCart = (productId, quantity = 1) =>
    axiosInstance.post("/cart/items", { product: productId, quantity });

export const updateCartItem = (productId, quantity) =>
    axiosInstance.patch(`/cart/items/${productId}`, { quantity });

export const removeCartItem = (productId) =>
    axiosInstance.delete(`/cart/items/${productId}`);

export const clearCart = () => axiosInstance.delete("/cart/items");
