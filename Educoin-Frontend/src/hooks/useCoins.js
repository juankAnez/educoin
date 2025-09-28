import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { coinsService } from "../services/coins"
import toast from "react-hot-toast"

export const useCoins = () => {
  const queryClient = useQueryClient()

  // Get wallet/balance
  const {
    data: wallet,
    isLoading: isLoadingWallet,
    error: walletError,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: coinsService.getWallet,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Get transactions
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: coinsService.getTransactions,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: coinsService.createTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      toast.success("Transacción realizada exitosamente")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error al realizar la transacción")
    },
  })

  return {
    wallet,
    transactions,
    isLoadingWallet,
    isLoadingTransactions,
    walletError,
    transactionsError,
    createTransaction: createTransactionMutation.mutate,
    isCreatingTransaction: createTransactionMutation.isPending,
  }
}
