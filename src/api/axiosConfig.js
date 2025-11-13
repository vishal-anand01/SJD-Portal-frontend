// frontend/src/api/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Attach token before every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("sjd_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("sjd_token");
      localStorage.removeItem("sjd_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
