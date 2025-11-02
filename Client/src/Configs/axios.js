import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", // ✅ fix: remove "process."
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, 
});

export default api;
