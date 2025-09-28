import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const activityService = {
  async getActivities(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.ACTIVITIES, { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las actividades")
    }
  },

  async getActivity(id) {
    try {
      const response = await api.get(API_ENDPOINTS.ACTIVITY_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener la actividad")
    }
  },

  async createActivity(activityData) {
    try {
      const response = await api.post(API_ENDPOINTS.ACTIVITIES, activityData)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.title?.[0] || "Error al crear la actividad"
      throw new Error(errorMessage)
    }
  },

  async updateActivity(id, activityData) {
    try {
      const response = await api.put(API_ENDPOINTS.ACTIVITY_DETAIL(id), activityData)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.title?.[0] || "Error al actualizar la actividad"
      throw new Error(errorMessage)
    }
  },

  async deleteActivity(id) {
    try {
      await api.delete(API_ENDPOINTS.ACTIVITY_DETAIL(id))
      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al eliminar la actividad")
    }
  },

  async completeActivity(id) {
    try {
      const response = await api.post(`${API_ENDPOINTS.ACTIVITY_DETAIL(id)}complete/`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al completar la actividad")
    }
  },

  async assignCoins(activityId, studentId, coins) {
    try {
      const response = await api.post(`${API_ENDPOINTS.ACTIVITY_DETAIL(activityId)}assign-coins/`, {
        student_id: studentId,
        coins: coins,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al asignar Educoins")
    }
  },
}
