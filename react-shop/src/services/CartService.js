import httpAxios from "./httpAxios";

const extractContent = (data) => {
  if (data.content) return data.content;
  return data;
};

const CartService = {
  getCart: async () => {
    try {
      const res = await httpAxios.get("/cart");
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await httpAxios.post("/cart/add", { productId, quantity });
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const res = await httpAxios.put(`/cart/items/${itemId}`, { quantity });
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      const res = await httpAxios.delete(`/cart/items/${itemId}`);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  clearCart: async () => {
    try {
      const res = await httpAxios.delete("/cart/clear");
      return res.data;
    } catch (error) {
      throw error.response || error;
    }
  },
};

export default CartService;