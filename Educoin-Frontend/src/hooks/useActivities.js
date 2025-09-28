import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { activityService } from "../services/activities"
import toast from "react-hot-toast"

export const useActivities = (params = {}) => {
  return useQuery({
    queryKey: ["activities", params],
    queryFn: () => activityService.getActivities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useActivity = (id) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityService.getActivity(id),
    enabled: !!id,
  })
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activityService.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      toast.success("Actividad creada exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => activityService.updateActivity(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      queryClient.invalidateQueries({ queryKey: ["activity", variables.id] })
      toast.success("Actividad actualizada exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activityService.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      toast.success("Actividad eliminada exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCompleteActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activityService.completeActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      toast.success("¡Actividad completada! Educoins asignados")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useAssignCoins = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ activityId, studentId, coins }) => activityService.assignCoins(activityId, studentId, coins),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      toast.success("Educoins asignados exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
