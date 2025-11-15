import httpAxios from "./httpAxios";

const extractContent = (data) => {
  if (data._embedded) {
    const list = data._embedded.categoryDtoList || [];
    return list.map(item => item.content || item);
  }
  if (data.content) return data.content;
  return data;
};

const CategoryService = {
  getAll: async () => {
    try {
      const res = await httpAxios.get("/categories");
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },
  
  getById: async (id) => {
    try {
      const res = await httpAxios.get(`/categories/${id}`);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },
  
  create: async (data) => {
    try {
      const res = await httpAxios.post("/categories", data);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },
  
  update: async (id, data) => {
    try {
      const res = await httpAxios.put(`/categories/${id}`, data);
      return extractContent(res.data);
    } catch (error) {
      throw error.response || error;
    }
  },
  
  delete: async (id) => {
    try {
      const res = await httpAxios.delete(`/categories/${id}`);
      return res.data;
    } catch (error) {
      throw error.response || error;
    }
  },
};

export default CategoryService;