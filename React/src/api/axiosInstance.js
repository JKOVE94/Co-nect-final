import axios from "axios";
const server = process.env.REACT_APP_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `${server}:3000`,
  timeout: 5000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post("/conect/refresh-token");
        const newAccessToken = data.accessToken;
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        isRefreshing = false;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        // 리프레시 토큰 갱신 실패 시 로그아웃 처리
        window.dispatchEvent(new CustomEvent("logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const refreshTokenAndGetUser = async () => {
  try {
    const { data } = await axiosInstance.post("/conect/refresh-token");
    if (data && data.accessToken) {
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + data.accessToken;
      return data;
    }
    throw new Error("Access token not found in refresh token response");
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // 리프레시 토큰 갱신 실패 시 로그아웃 처리
    window.dispatchEvent(new CustomEvent("logout"));
    throw error;
  }
};

// 토큰 설정 함수 추가
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
