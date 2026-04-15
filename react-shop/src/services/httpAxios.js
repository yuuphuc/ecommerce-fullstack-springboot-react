import axios from "axios";

// Tự động chuyển đổi link API tùy theo môi trường
const baseURL = process.env.NODE_ENV === 'production'
  ? "https://ecommerce-fullstack-springboot-react.onrender.com"
  : "http://localhost:8080";

const httpAxios = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  // Tăng timeout lên 60 giây để xử lý các request chậm khi chờ Render
  timeout: 60000 ,
});

// Request Interceptor: Tự động thêm token
httpAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý token hết hạn
httpAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const oldToken = localStorage.getItem("token");
        
        if (!oldToken) {
          // Không có token → Redirect login
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${baseURL}/api/auth/refresh`,
          { token: oldToken }
        );

        const newToken = response.data.jwt;
        
        // Lưu token mới
        localStorage.setItem("token", newToken);
        
        // Retry request với token mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpAxios(originalRequest);

      } catch (refreshError) {
        // Refresh thất bại → Xóa token và redirect
        console.error("❌ Token refresh failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpAxios;