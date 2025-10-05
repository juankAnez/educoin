import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const activityService = {
  async getAll() {
    const res = await api.get(API_ENDPOINTS.ACTIVITIES)
    return res.data
  },

  async getById(id) {
    const res = await api.get(API_ENDPOINTS.ACTIVITY_DETAIL(id))
    return res.data
  },

  async create(data) {
    const res = await api.post(API_ENDPOINTS.ACTIVITIES, data)
    return res.data
  },

  async update(id, data) {
    const res = await api.patch(API_ENDPOINTS.ACTIVITY_DETAIL(id), data)
    return res.data
  },

  async remove(id) {
    const res = await api.delete(API_ENDPOINTS.ACTIVITY_DETAIL(id))
    return res.data
  },
}
