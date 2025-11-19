import axios, { AxiosInstance } from "axios";
import { store } from "../stores";
import { clearTokens, setTokens } from "../stores/authSlice";
import { refreshToken } from "./refreshToken";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- Request Interceptor ----------------
// Thêm token nếu có
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ---------------- Response Interceptor ----------------
// Xử lý lỗi chung hoặc logout nếu 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshToken();
        if (res.data?.access_token) {
          store.dispatch(
            setTokens({
              accessToken: res.data.access_token,
              refreshToken: "",
              userId: res.data.user_id ?? "",
              role: res.data.role ?? "",
            }),
          );
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        store.dispatch(clearTokens());
        // Chỉ redirect về login nếu không phải đang ở trang login
        if (window.location.pathname !== "/login") {
          window.location.href = `/login`;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
