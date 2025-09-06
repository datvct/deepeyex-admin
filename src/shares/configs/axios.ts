import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8081", 
  timeout: 5000,                   
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- Request Interceptor ----------------
// Thêm token nếu có
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token"); // lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// ---------------- Response Interceptor ----------------
// Xử lý lỗi chung hoặc logout nếu 401
api.interceptors.response.use(
  response => response, // nếu request thành công, trả response về
  error => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Token hết hạn hoặc không hợp lệ → redirect login
        console.warn("Unauthorized! Redirecting to login...");
        window.location.href = "/login";
      } else if (status >= 500) {
        console.error("Server error:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
