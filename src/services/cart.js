import API from "./api.js";

export const cartAPI = {
  get: () => API.get("/cart"),

  add: (productId, quantity = 1) =>
    API.post("/cart/add", { productId, quantity }),

  updateItem: (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity }),

  removeItem: (itemId) => API.delete(`/cart/${itemId}`),

  clear: () => API.delete("/cart"),
};
