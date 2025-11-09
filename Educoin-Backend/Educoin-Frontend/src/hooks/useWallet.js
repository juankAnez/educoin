import { useQuery } from "@tanstack/react-query"
import api from "../services/api"

// Wallet principal del usuario
export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await api.get("/api/coins/wallets/mi_wallet/")
      return res.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// Todas las wallets del usuario
export const useAllWallets = () => {
  return useQuery({
    queryKey: ["all-wallets"],
    queryFn: async () => {
      const res = await api.get("/api/coins/wallets/")
      return res.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// Períodos (solo para docentes)
export const usePeriods = (enabled = true) => {
  return useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await api.get("/api/coins/periods/")
      return res.data
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

// Transacciones del usuario
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.get("/api/coins/transactions/")
      return res.data
    },
    staleTime: 2 * 60 * 1000,
  })
}