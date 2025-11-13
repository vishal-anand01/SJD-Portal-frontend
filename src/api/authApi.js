// Path: frontend/src/api/authApi.js
import axios from "./axiosConfig";

export const loginApi = (payload) => axios.post("/auth/login", payload);
export const registerApi = (payload) => axios.post("/auth/register", payload);
export const forgotPasswordApi = (payload) => axios.post("/auth/forgot-password", payload);
export const resetPasswordApi = (token, payload) => axios.post(`/auth/reset-password/${token}`, payload);
