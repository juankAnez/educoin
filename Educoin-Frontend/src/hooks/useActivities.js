import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"
import { API_ENDPOINTS } from "../utils/constants"

// --- Obtener todas las actividades ---
export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ACTIVITIES)
      return response.data
    },
  })
}

// --- Obtener una actividad específica ---
export function useActivity(activityId) {
  return useQuery({
    queryKey: ["activity", activityId],
    queryFn: async () => {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES}${activityId}/`)
      return response.data
    },
    enabled: !!activityId,
  })
}

// --- Crear una nueva actividad ---
export function useCreateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newActivity) => {
      const response = await api.post(API_ENDPOINTS.ACTIVITIES, newActivity, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  })
}

// --- Editar una actividad ---
export function useUpdateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const response = await api.patch(`${API_ENDPOINTS.ACTIVITIES}${id}/`, updates)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["activities"])
      queryClient.invalidateQueries(["activity", data.id])
    },
  })
}

// --- Eliminar actividad ---
export function useDeleteActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`${API_ENDPOINTS.ACTIVITIES}${id}/`)
      return id
    },
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  })
}

// --- Completar actividad (estudiante) ---
export function useCompleteActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`${API_ENDPOINTS.ACTIVITIES}${id}/complete/`)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  })
}

// --- Asignar Educoins (docente) ---
export function useAssignCoins() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ activityId, studentId, coins }) => {
      const res = await api.post(`/activities/${activityId}/assign-coins/`, {
        student_id: studentId,
        coins,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activities"])
      queryClient.invalidateQueries(["activity"])
    },
  })
}
