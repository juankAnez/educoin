import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const auctionService = {
  async getAuctions(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.AUCTIONS, { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las subastas")
    }
  },

  async getAuction(id) {
    try {
      const response = await api.get(API_ENDPOINTS.AUCTION_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener la subasta")
    }
  },

  async createAuction(auctionData) {
    try {
      const response = await api.post("/auctions/api/create/", auctionData)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.titulo?.[0] || "Error al crear la subasta"
      throw new Error(errorMessage)
    }
  },

  async updateAuction(id, auctionData) {
    try {
      const response = await api.put(API_ENDPOINTS.AUCTION_DETAIL(id), auctionData)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.titulo?.[0] || "Error al actualizar la subasta"
      throw new Error(errorMessage)
    }
  },

  async deleteAuction(id) {
    try {
      await api.delete(API_ENDPOINTS.AUCTION_DETAIL(id))
      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al eliminar la subasta")
    }
  },

  async placeBid(auctionId, cantidad) {
    try {
      const response = await api.post(API_ENDPOINTS.PLACE_BID, {
        auction_id: auctionId,
        cantidad: cantidad,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al realizar la puja")
    }
  },

  async closeAuction(auctionId) {
    try {
      const response = await api.post(API_ENDPOINTS.CLOSE_AUCTION(auctionId))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al cerrar la subasta")
    }
  },

  async getMyBids() {
    try {
      const response = await api.get(API_ENDPOINTS.MY_BIDS)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las pujas")
    }
  },

  async getAuctionBids(auctionId) {
    try {
      const response = await api.get(`${API_ENDPOINTS.AUCTION_DETAIL(auctionId)}bids/`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Error al obtener las pujas")
    }
  },
}
