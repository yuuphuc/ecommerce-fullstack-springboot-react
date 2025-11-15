// src/services/UserService.js
import httpAxios from "./httpAxios";

const UserService = {
  // Lấy thông tin profile của user hiện tại
  getProfile: async () => {
    try {
      const res = await httpAxios.get("/users/profile");
      return res.data;
    } catch (error) {
      throw error.response || error;
    }
  },

  // Cập nhật profile của user hiện tại
  updateProfile: async (data) => {
    try {
      const res = await httpAxios.put("/users/profile", data);
      return res.data;
    } catch (error) {
      throw error.response || error;
    }
  },
};

export default UserService;