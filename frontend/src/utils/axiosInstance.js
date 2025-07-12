// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // No trailing slash
});

// Attach token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to debug
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("🔍 Axios Response:", response);
    console.log("🔍 Response Data Type:", typeof response.data);
    console.log("🔍 Response Headers:", response.headers);
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
