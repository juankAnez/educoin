import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"
import toast from "react-hot-toast"

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/api/users/")
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/api/users/${id}/`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Usuario actualizado")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error al actualizar usuario")
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/users/${id}/`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Usuario eliminado")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error al eliminar usuario")
    },
  })
}