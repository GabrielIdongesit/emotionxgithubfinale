import API from "./api.js";

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getProfile: (id) => API.get(`/auth/profile/${id}`),
  updateProfile: (id, data) => API.patch(`/auth/update/${id}`, data),
};
