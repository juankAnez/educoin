import api from "./api"

// Obtener la wallet del usuario autenticado
export const getWallet = () => api.get("/api/coins/wallets/")

// Registrar una transacción (opcional, si lo usás)
export const createTransaction = (data) =>
  api.post("/api/coins/transactions/", data)
