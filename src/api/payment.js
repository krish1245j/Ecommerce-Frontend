import axiosInstance from "./axiosInstance";

// POST /api/payment/create-order
export const createRazorpayOrder = (shippingAddress) =>
    axiosInstance.post(
        "/payment/create-order",
        shippingAddress
    );

// POST /api/payment/verify
export const verifyRazorpayPayment = (payload) =>
    axiosInstance.post(
        "/payment/verify",
        payload
    );