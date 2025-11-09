import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { auctionService } from "../services/auctions"
import toast from "react-hot-toast"

export const useAuctions = (params = {}) => {
  return useQuery({
    queryKey: ["auctions", params],
    queryFn: async () => {
      const data = await auctionService.getAuctions(params)
      // Asegurar que siempre devolvemos un array
      if (Array.isArray(data)) {
        return data
      } else if (data && typeof data === 'object') {
        // Si es un objeto con una propiedad results (paginación Django)
        return data.results || []
      }
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useAuction = (id) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => auctionService.getAuction(id),
    enabled: !!id,
  })
}

export const useCreateAuction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: auctionService.createAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] })
      toast.success("Subasta creada exitosamente")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Error al crear subasta"
      toast.error(errorMessage)
    },
  })
}

export const useUpdateAuction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => auctionService.updateAuction(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] })
      queryClient.invalidateQueries({ queryKey: ["auction", variables.id] })
      toast.success("Subasta actualizada exitosamente")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Error al actualizar subasta"
      toast.error(errorMessage)
    },
  })
}

export const useDeleteAuction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: auctionService.deleteAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] })
      toast.success("Subasta eliminada exitosamente")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Error al eliminar subasta"
      toast.error(errorMessage)
    },
  })
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ auctionId, cantidad }) => auctionService.placeBid(auctionId, cantidad),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] })
      queryClient.invalidateQueries({ queryKey: ["auction", variables.auctionId] })
      queryClient.invalidateQueries({ queryKey: ["auction-bids", variables.auctionId] })
      queryClient.invalidateQueries({ queryKey: ["wallet"] })
      queryClient.invalidateQueries({ queryKey: ["all-wallets"] })
      toast.success("Puja realizada exitosamente")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          Array.isArray(error.response?.data?.non_field_errors) ? 
                          error.response.data.non_field_errors[0] : 
                          "Error al realizar puja"
      toast.error(errorMessage)
    },
  })
}

export const useAuctionBids = (auctionId) => {
  return useQuery({
    queryKey: ["auction-bids", auctionId],
    queryFn: () => auctionService.getAuctionBids(auctionId),
    enabled: !!auctionId,
    refetchInterval: 30000,
  })
}

export const useCloseAuction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: auctionService.closeAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] })
      toast.success("Subasta cerrada exitosamente")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Error al cerrar subasta"
      toast.error(errorMessage)
    },
  })
}