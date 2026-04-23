import API from "./api.js";

export const productAPI = {
  getAll: (params = {}) => API.get("/products", { params }),
  // params: { category, type, minPrice, maxPrice, search }

  getById: (id) => API.get(`/products/${id}`),

  getTopRated: () => API.get("/products/top"),

  create: (formData) =>
    API.post("/products/new", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    API.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => API.delete(`/products/${id}`),
};
