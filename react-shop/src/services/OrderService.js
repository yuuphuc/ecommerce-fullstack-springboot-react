import httpAxios from "./httpAxios";

const extractContent = (data) => {
  if (!data) return [];
  
  // Nếu có _embedded (HATEOAS)
  if (data._embedded) {
    const list = data._embedded.orderDtoList || [];
    return list.map(item => item.content || item);
  }
  
  // Nếu có content
  if (data.content) return data.content;
  
  if (Array.isArray(data)) return data;
  
  return data;
};

const OrderService = {
  createOrder: async (orderData) => {
    try {
      const res = await httpAxios.post("/orders", orderData);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  getMyOrders: async () => {
    try {
      const res = await httpAxios.get("/orders/my-orders");
      const result = extractContent(res.data);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error in getMyOrders:", error);
      return []; // ✅ Trả về array rỗng nếu lỗi
    }
  },

  getOrderById: async (orderId) => {
    try {
      const res = await httpAxios.get(`/orders/${orderId}`);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const res = await httpAxios.put(`/orders/${orderId}/cancel`);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  getAllOrders: async () => {
    try {
      const res = await httpAxios.get("/orders");
      const result = extractContent(res.data);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      return [];
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await httpAxios.put(`/orders/${orderId}/status`, { status });
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const res = await httpAxios.delete(`/orders/${orderId}`);
      return res.data;
    } catch (error) {
      throw error.response || error;
    }
  },
};

export default OrderService;
