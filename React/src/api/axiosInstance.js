// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000", // API 서버 주소로 변경
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // 세션 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
