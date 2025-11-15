// src/services/ProductService.js
import httpAxios from "./httpAxios";

/**
 * Helper function để extract data từ HATEOAS response
 */
const extractContent = (data) => {
  // Nếu có _embedded (collection)
  if (data._embedded) {
    const list = data._embedded.productDtoList || [];
    return list.map(item => item.content || item);
  }
  // Nếu có content (single entity)
  if (data.content) {
    return data.content;
  }
  // Nếu là plain object
  return data;
};

const ProductService = {
  getAll: async () => {
    try {
      const res = await httpAxios.get("/products");
      return extractContent(res.data);
    } catch (error) {
      console.error("getAll error:", error);
      throw error.response || error;
    }
  },
  
  getById: async (id) => {
    try {
      const res = await httpAxios.get(`/products/${id}`);
      return extractContent(res.data);
    } catch (error) {
      console.error("getById error:", error);
      throw error.response || error;
    }
  },
  
  create: async (data) => {
    try {
      const res = await httpAxios.post("/products", data);
      return extractContent(res.data);
    } catch (error) {
      console.error("create error:", error);
      throw error.response || error;
    }
  },
  
  update: async (id, data) => {
    try {
      const res = await httpAxios.put(`/products/${id}`, data);
      return extractContent(res.data);
    } catch (error) {
      console.error("update error:", error);
      throw error.response || error;
    }
  },
  
  delete: async (id) => {
    try {
      const res = await httpAxios.delete(`/products/${id}`);
      return res.data;
    } catch (error) {
      console.error("delete error:", error);
      throw error.response || error;
    }
  },
  
  // Truy vấn đặc biệt
  findByName: async (name) => {
    try {
      const res = await httpAxios.get(`/products/search?name=${name}`);
      return extractContent(res.data);
    } catch (error) {
      console.error("findByName error:", error);
      throw error.response || error;
    }
  },
  
  findByPriceRange: async (min, max) => {
    try {
      const res = await httpAxios.get(`/products/price?min=${min}&max=${max}`);
      return extractContent(res.data);
    } catch (error) {
      console.error("findByPriceRange error:", error);
      throw error.response || error;
    }
  },
  
  findByCategory: async (cateId) => {
    try {
      const res = await httpAxios.get(`/products/category/${cateId}`);
      return extractContent(res.data);
    } catch (error) {
      console.error("findByCategory error:", error);
      throw error.response || error;
    }
  },
};

export default ProductService;