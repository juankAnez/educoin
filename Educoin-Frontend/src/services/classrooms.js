import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const classroomService = {
  getClassrooms: async () => {
    const res = await api.get(API_ENDPOINTS.CLASSROOMS) 
    return res.data
  },
  getClassroom: async (id) => {
    const res = await api.get(`${API_ENDPOINTS.CLASSROOMS}${id}/`)
    return res.data
  },
  createClassroom: async (data) => {
    const res = await api.post(API_ENDPOINTS.CLASSROOMS, data)
    return res.data
  },
  updateClassroom: async (id, data) => {
    const res = await api.put(`${API_ENDPOINTS.CLASSROOMS}${id}/`, data)
    return res.data
  },
  deleteClassroom: async (id) => {
    const res = await api.delete(`${API_ENDPOINTS.CLASSROOMS}${id}/`)
    return res.data
  },
  joinClassroom: async (id) => {
    const res = await api.post(`${API_ENDPOINTS.CLASSROOMS}${id}/join/`)
    return res.data
  },
  getClassroomStudents: async (id) => {
    const res = await api.get(`${API_ENDPOINTS.CLASSROOMS}${id}/students/`)
    return res.data
  },
}
