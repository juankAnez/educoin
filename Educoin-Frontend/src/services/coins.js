import api from "./api"

export const coinsService = {
  // Get user wallet/balance
  getWallet: async () => {
    const response = await api.get("/coins/api/v2/wallets/")
    return response.data
  },

  // Get transaction history
  getTransactions: async (params = {}) => {
    const response = await api.get("/coins/api/v2/transactions/", { params })
    return response.data
  },

  // Create new transaction (assign coins)
  createTransaction: async (transactionData) => {
    const response = await api.post("/coins/api/v2/transactions/", transactionData)
    return response.data
  },

  // Get user balance
  getBalance: async (userId) => {
    const response = await api.get(`/coins/api/v2/wallets/?user=${userId}`)
    return response.data
  },
}
