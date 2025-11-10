import { useQuery } from "@tanstack/react-query"
import api from "../services/api"

export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/coins/wallets/");
        // Si devuelve array, tomar el primero
        if (Array.isArray(res.data)) {
          return res.data[0] || null;
        }
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  })
}

export const useAllWallets = () => {
  return useQuery({
    queryKey: ["all-wallets"],
    queryFn: async () => {
      const res = await api.get("/api/coins/wallets/")
      return Array.isArray(res.data) ? res.data : res.data.results || []
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const usePeriods = (enabled = true) => {
  return useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await api.get("/api/coins/periods/")
      return Array.isArray(res.data) ? res.data : res.data.results || []
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.get("/api/coins/transactions/")
      return Array.isArray(res.data) ? res.data : res.data.results || []
    },
    staleTime: 2 * 60 * 1000,
  })
}