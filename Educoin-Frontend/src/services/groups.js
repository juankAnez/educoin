import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const groupsService = {
  // Obtener todos los grupos (filtrados por rol)
  async getGroups() {
    const res = await api.get(API_ENDPOINTS.GROUPS)
    return res.data
  },

  // Obtener un grupo específico
  async getGroup(id) {
    const res = await api.get(API_ENDPOINTS.GROUP_DETAIL(id))
    return res.data
  },

  // Crear grupo (solo docentes)
  async createGroup(data) {
    const res = await api.post(API_ENDPOINTS.GROUPS, data)
    return res.data
  },

  // Actualizar grupo
  async updateGroup(id, data) {
    const res = await api.patch(API_ENDPOINTS.GROUP_DETAIL(id), data)
    return res.data
  },

  // Eliminar grupo
  async deleteGroup(id) {
    const res = await api.delete(API_ENDPOINTS.GROUP_DETAIL(id))
    return res.data
  },

  // Unirse a grupo por código (estudiantes)
  async joinGroupByCode(code) {
    const res = await api.post(API_ENDPOINTS.GROUP_JOIN_BY_CODE, { code })
    return res.data
  },

  // Unirse a grupo por ID directo
  async joinGroupById(id) {
    const res = await api.post(API_ENDPOINTS.GROUP_JOIN_BY_ID(id))
    return res.data
  },

  // Obtener estudiantes de un grupo
  async getGroupStudents(id) {
    const res = await api.get(API_ENDPOINTS.GROUP_DETAIL(id))
    return res.data.estudiantes || []
  },
}