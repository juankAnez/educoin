import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const groupService = {
  async getGroups() {
    try {
      const response = await api.get(API_ENDPOINTS.GROUPS)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener los grupos")
    }
  },

  async getGroup(id) {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener el grupo")
    }
  },

  async createGroup(groupData) {
    try {
      const response = await api.post(API_ENDPOINTS.GROUPS, groupData)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.name?.[0] || "Error al crear el grupo"
      throw new Error(errorMessage)
    }
  },

  async updateGroup(id, groupData) {
    try {
      const response = await api.put(API_ENDPOINTS.GROUP_DETAIL(id), groupData)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.name?.[0] || "Error al actualizar el grupo"
      throw new Error(errorMessage)
    }
  },

  async deleteGroup(id) {
    try {
      await api.delete(API_ENDPOINTS.GROUP_DETAIL(id))
      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al eliminar el grupo")
    }
  },

  async getStudentGroups() {
    try {
      const response = await api.get(API_ENDPOINTS.STUDENT_GROUPS)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las inscripciones")
    }
  },

  async addStudentToGroup(groupId, studentId) {
    try {
      const response = await api.post(API_ENDPOINTS.STUDENT_GROUPS, {
        group: groupId,
        student: studentId,
        active: true,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al agregar estudiante al grupo")
    }
  },

  async removeStudentFromGroup(studentGroupId) {
    try {
      await api.delete(`${API_ENDPOINTS.STUDENT_GROUPS}${studentGroupId}/`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al remover estudiante del grupo")
    }
  },
}
