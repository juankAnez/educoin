import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const groupsService = {
  async getGroups() {
    const res = await api.get(API_ENDPOINTS.GROUPS)
    return res.data
  },

  async createGroup(data) {
    const res = await api.post(API_ENDPOINTS.GROUPS, data)
    return res.data
  },

  async joinGroup(code) {
    const res = await api.post("/api/groups/join/", { code })
    return res.data
  },

  async updateGroup(id, data) {
    const res = await api.put(`${API_ENDPOINTS.GROUPS}${id}/`, data)
    return res.data
  },

  async deleteGroup(id) {
    const res = await api.delete(`${API_ENDPOINTS.GROUPS}${id}/`)
    return res.data
  },
}
