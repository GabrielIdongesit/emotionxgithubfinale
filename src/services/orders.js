import API from "./api.js";

export const orderAPI = {
  // Create order from current cart
  create: (data) => API.post("/orders", data),
  // data: { paymentMethod: "card"|"bitcoin", deliveryType, shippingAddress }

  getMyOrders: () => API.get("/orders/my-orders"),

  getById: (id) => API.get(`/orders/${id}`),

  // Admin only
  getAll: () => API.get("/orders"),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};
