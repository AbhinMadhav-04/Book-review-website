// src/api.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from your AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
