import axiosInstance from "./axiosInstance";

export const getOrders = () => axiosInstance.get("/transaction/orders");
export const cancelOrder = (orderId) => axiosInstance.patch(`/transaction/orders/${orderId}`);
