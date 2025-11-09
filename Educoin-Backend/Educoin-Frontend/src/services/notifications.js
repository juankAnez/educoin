import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const notificationService = {
  async getNotifications(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.NOTIFICATIONS, { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las notificaciones")
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`${API_ENDPOINTS.NOTIFICATIONS}${notificationId}/`, {
        read: true,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al marcar como leída")
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.post(`${API_ENDPOINTS.NOTIFICATIONS}mark_all_read/`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al marcar todas como leídas")
    }
  },

  async deleteNotification(notificationId) {
    try {
      await api.delete(`${API_ENDPOINTS.NOTIFICATIONS}${notificationId}/`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al eliminar la notificación")
    }
  },
}
