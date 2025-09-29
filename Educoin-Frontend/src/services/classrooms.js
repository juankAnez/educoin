import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const classroomService = {
  async getClassrooms() {
    try {
      const response = await api.get(API_ENDPOINTS.CLASSROOMS)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las clases")
    }
  },

  async getClassroom(id) {
    try {
      const response = await api.get(API_ENDPOINTS.CLASSROOM_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener la clase")
    }
  },

  async createClassroom(classroomData) {
    try {
      const payload = {
        nombre: classroomData.name,                    // ← back espera "nombre"
        descripcion: classroomData.description || "",  // opcional
        // NO envíes docente ni estudiantes
      }

      const response = await api.post(API_ENDPOINTS.CLASSROOMS, payload)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.nombre?.[0] ||
        error.response?.data?.estudiantes?.[0] ||
        "Error al crear la clase"
      throw new Error(errorMessage)
    }
  },

  async updateClassroom(id, classroomData) {
    try {
      const response = await api.put(API_ENDPOINTS.CLASSROOM_DETAIL(id), classroomData)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.name?.[0] || "Error al actualizar la clase"
      throw new Error(errorMessage)
    }
  },

  async deleteClassroom(id) {
    try {
      await api.delete(API_ENDPOINTS.CLASSROOM_DETAIL(id))
      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al eliminar la clase")
    }
  },

  async joinClassroom(code) {
    try {
      // si tu endpoint real es /users/api/v2/classrooms/join/
      const response = await api.post("/users/api/v2/classrooms/join/", { code })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al unirse a la clase")
    }
  },

  async getClassroomStudents(id) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CLASSROOM_DETAIL(id)}students/`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener los estudiantes")
    }
  },

  async addStudentsToClassroom(classroomId, studentIds) {
    const payload = { estudiantes: studentIds }
    const response = await api.patch(API_ENDPOINTS.CLASSROOM_DETAIL(classroomId), payload)
    return response.data
  },
}
