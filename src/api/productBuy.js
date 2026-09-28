import axiosInstance from "./axiosInstance";

export const getProduct = (productId)=>{
    return axiosInstance.get(`/products/${productId}`)
}