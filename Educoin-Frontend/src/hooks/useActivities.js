import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { activityService } from "../services/activities"

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: activityService.getAll,
  })
}

export const useActivity = (id) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityService.getById(id),
    enabled: !!id,
  })
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activityService.create,
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  })
}

export const useUpdateActivity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => activityService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  })
}

export const useDeleteActivity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activityService.remove,
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  })
}

// Si no usas esto aún, puedes dejarlo vacío o borrarlo del import
export const useAssignCoins = () => {
  console.warn("useAssignCoins aún no implementado.")
  return {}
}

export const useCompleteActivity = () => {
  console.warn("useCompleteActivity aún no implementado.")
  return {}
}
