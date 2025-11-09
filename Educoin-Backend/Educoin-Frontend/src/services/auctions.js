import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const auctionService = {
  // Obtener todas las subastas
  getAuctions: async (params = {}) => {
    const res = await api.get(API_ENDPOINTS.AUCTIONS, { params })
    return res.data
  },

  // Obtener una subasta específica
  getAuction: async (id) => {
    const res = await api.get(API_ENDPOINTS.AUCTION_DETAIL(id))
    return res.data
  },

  // Crear subasta (solo docentes)
  createAuction: async (data) => {
    const res = await api.post(API_ENDPOINTS.AUCTIONS, data)
    return res.data
  },

  // Actualizar subasta
  updateAuction: async (id, data) => {
    const res = await api.patch(API_ENDPOINTS.AUCTION_DETAIL(id), data)
    return res.data
  },

  // Eliminar subasta
  deleteAuction: async (id) => {
    const res = await api.delete(API_ENDPOINTS.AUCTION_DETAIL(id))
    return res.data
  },

  // Hacer una puja
  placeBid: async (auctionId, cantidad) => {
    const res = await api.post(`${API_ENDPOINTS.AUCTIONS}bids/`, {
      auction: auctionId,
      cantidad: cantidad
    })
    return res.data
  },

  // Obtener pujas de una subasta
  getAuctionBids: async (auctionId) => {
    const res = await api.get(`${API_ENDPOINTS.AUCTIONS}bids/`, {
      params: { auction: auctionId }
    })
    return res.data
  },

  // Cerrar subasta (solo docentes)
  closeAuction: async (id) => {
    const res = await api.post(API_ENDPOINTS.AUCTION_CLOSE(id))
    return res.data
  }
}