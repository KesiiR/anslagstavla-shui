import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const messageAPI = {
  getAll: async (sortOrder = "") => {
    const url = sortOrder
      ? `${API_URL}/messages?sortOrder=${sortOrder}`
      : `${API_URL}/messages`;
    const response = await axios.get(url);
    return response.data;
  },

  create: async (messageData) => {
    const response = await axios.post(`${API_URL}/messages`, messageData);
    return response.data;
  },

  update: async (id, text) => {
    const response = await axios.put(`${API_URL}/messages/${id}`, { text });
    return response.data;
  },

  getByUser: async (username) => {
    const response = await axios.get(`${API_URL}/messages/${username}`);
    return response.data;
  },
};
