import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const groupsService = {
  async getGroups() {
    const res = await api.get(API_ENDPOINTS.GROUPS)
    const groups = res.data
    
    // Si los grupos no tienen información de classroom completa, la obtenemos
    const groupsWithClassroom = await Promise.all(
      groups.map(async (group) => {
        if (group.classroom && typeof group.classroom === 'number') {
          try {
            const classroomRes = await api.get(`/api/classrooms/${group.classroom}/`)
            return {
              ...group,
              classroom: classroomRes.data
            }
          } catch (error) {
            console.error(`Error obteniendo classroom ${group.classroom}:`, error)
            return {
              ...group,
              classroom: { id: group.classroom, nombre: "Sin clase asignada" }
            }
          }
        }
        return group
      })
    )
    
    return groupsWithClassroom
  },

  async getGroup(id) {
    const res = await api.get(API_ENDPOINTS.GROUP_DETAIL(id))
    return res.data
  },

  async createGroup(data) {
    const res = await api.post(API_ENDPOINTS.GROUPS, data)
    return res.data
  },

  async updateGroup(id, data) {
    const res = await api.patch(API_ENDPOINTS.GROUP_DETAIL(id), data)
    return res.data
  },

  async deleteGroup(id) {
    const res = await api.delete(API_ENDPOINTS.GROUP_DETAIL(id))
    return res.data
  },

  async joinGroup(code) {
    const res = await api.post(API_ENDPOINTS.GROUP_JOIN_BY_CODE, { code })
    return res.data
  },

  async getGroupStudents(id) {
    const res = await api.get(API_ENDPOINTS.GROUP_DETAIL(id))
    return res.data.estudiantes || []
  },
}