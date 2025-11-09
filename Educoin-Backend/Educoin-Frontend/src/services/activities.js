import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const activityService = {
  // Obtener todas las actividades (filtradas por rol en backend)
  getActivities: async (params = {}) => {
    const res = await api.get(API_ENDPOINTS.ACTIVITIES, { params })
    return res.data
  },

  // Obtener una actividad específica
  getActivity: async (id) => {
    const res = await api.get(API_ENDPOINTS.ACTIVITY_DETAIL(id))
    return res.data
  },

  // Crear actividad (solo docentes)
  createActivity: async (data) => {
    const res = await api.post(API_ENDPOINTS.ACTIVITIES, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },

  // Actualizar actividad
  updateActivity: async (id, data) => {
    const res = await api.patch(API_ENDPOINTS.ACTIVITY_DETAIL(id), data)
    return res.data
  },

  // Eliminar actividad
  deleteActivity: async (id) => {
    const res = await api.delete(API_ENDPOINTS.ACTIVITY_DETAIL(id))
    return res.data
  },

  // Obtener submissions de una actividad
  getActivitySubmissions: async (activityId) => {
    const res = await api.get(API_ENDPOINTS.SUBMISSIONS, {
      params: { activity: activityId }
    })
    return res.data
  },
}

export const submissionService = {
  // Obtener todas las submissions del usuario
  getSubmissions: async (params = {}) => {
    const res = await api.get(API_ENDPOINTS.SUBMISSIONS, { params })
    return res.data
  },

  // Obtener una submission específica
  getSubmission: async (id) => {
    const res = await api.get(API_ENDPOINTS.SUBMISSION_DETAIL(id))
    return res.data
  },

  // Crear submission (estudiantes)
  createSubmission: async (formData) => {
    const res = await api.post(API_ENDPOINTS.SUBMISSIONS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },

  // Actualizar submission
  updateSubmission: async (id, data) => {
    const res = await api.patch(API_ENDPOINTS.SUBMISSION_DETAIL(id), data)
    return res.data
  },

  // Calificar submission (docentes)
  gradeSubmission: async (id, data) => {
    const res = await api.patch(API_ENDPOINTS.SUBMISSION_GRADE(id), data)
    return res.data
  },
}