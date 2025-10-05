import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const groupsService = {
  getGroups: async () => {
    const res = await api.get(API_ENDPOINTS.GROUPS);
    return res.data;
  },
  createGroup: async (data) => {
    const res = await api.post(API_ENDPOINTS.GROUPS, data);
    return res.data;
  },
  updateGroup: async (id, data) => {
    const res = await api.put(`${API_ENDPOINTS.GROUPS}${id}/`, data);
    return res.data;
  },
  deleteGroup: async (id) => {
    await api.delete(`${API_ENDPOINTS.GROUPS}${id}/`);
  },
  joinGroup: async (code) => {
    const res = await api.post(API_ENDPOINTS.GROUP_JOIN(code));
    return res.data;
  },
};
