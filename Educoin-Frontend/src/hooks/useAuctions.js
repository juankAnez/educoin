import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { auctionService } from "../services/auctions"
import toast from "react-hot-toast"

export const useAuctions = (params = {}) => {
  return useQuery({
    queryKey: ["auctions", params],
    queryFn: () => auctionService.getAuctions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      toast.error(error.message)
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
      toast.error(error.message)
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
      toast.error(error.message)
    },
  })
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ auctionId, amount }) => auctionService.placeBid(auctionId, amount),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] })
      queryClient.invalidateQueries({ queryKey: ["auction", variables.auctionId] })
      queryClient.invalidateQueries({ queryKey: ["auction-bids", variables.auctionId] })
      toast.success("¡Puja realizada exitosamente!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useAuctionBids = (auctionId) => {
  return useQuery({
    queryKey: ["auction-bids", auctionId],
    queryFn: () => auctionService.getAuctionBids(auctionId),
    enabled: !!auctionId,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  })
}
