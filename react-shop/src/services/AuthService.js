import httpAxios from "./httpAxios";

const AuthService = {
  register: async (userData) => {
    try {
      const res = await httpAxios.post("/auth/register", userData);
      return res.data;
    } catch (error) {
      throw error.response?.data || "Đăng ký thất bại";
    }
  },

  // Lấy role từ token 
  getUserRole: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decode JWT payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      console.log("🔍 JWT Payload:", payload); // Debug

      // Kiểm tra authorities trong payload
      const authorities = payload.authorities || payload.roles || payload.role || [];

      console.log("🔍 Authorities:", authorities); // Debug

      // Xử lý authorities là string (VD: "ROLE_ADMIN,ROLE_USER")
      if (typeof authorities === "string") {
        if (authorities.includes("ADMIN")) {
          console.log("✅ User is ADMIN (string format)");
          return "ADMIN";
        }
        return "USER";
      }

      // Xử lý authorities là array
      if (Array.isArray(authorities)) {
        const hasAdmin = authorities.some(auth => {
          // Format 1: "ROLE_ADMIN"
          if (typeof auth === "string" && auth.includes("ADMIN")) {
            return true;
          }
          // Format 2: { authority: "ROLE_ADMIN" }
          if (auth && auth.authority && auth.authority.includes("ADMIN")) {
            return true;
          }
          return false;
        });

        if (hasAdmin) {
          console.log("✅ User is ADMIN (array format)");
          return "ADMIN";
        }
        return "USER";
      }

      console.log("⚠️ No authorities found, defaulting to USER");
      return "USER";

    } catch (error) {
      console.error("❌ Error parsing token:", error);
      return null;
    }
  },

  isAdmin: () => {
    const role = AuthService.getUserRole();
    console.log("🔍 Checking isAdmin, role:", role);
    return role === "ADMIN";
  },

  login: async (username, password) => {
    try {
      const res = await httpAxios.post("/auth/login", {
        username,
        password,
      });

      if (res.data.jwt) {
        localStorage.setItem("token", res.data.jwt);
        localStorage.setItem("username", res.data.username);

        const role = AuthService.getUserRole();
        localStorage.setItem("userRole", role);

        httpAxios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;
      }

      return res.data;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Đăng nhập thất bại!";

      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    delete httpAxios.defaults.headers.common["Authorization"];
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getCurrentUser: () => {
    return localStorage.getItem("username");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      httpAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Re-check role khi reload
      const role = AuthService.getUserRole();
      console.log("🔄 Auth initialized, role:", role);
    }
  },
};

export default AuthService;