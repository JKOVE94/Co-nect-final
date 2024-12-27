import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 API 주소
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
