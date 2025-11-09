import api from "./api"

export const auctionService = {
  getAuctions: async (params = {}) => {
    const res = await api.get("/api/auctions/", { params })
    return res.data
  },

  getAuction: async (id) => {
    const res = await api.get(`/api/auctions/${id}/`)
    return res.data
  },

  createAuction: async (data) => {
    const res = await api.post("/api/auctions/", data)
    return res.data
  },

  updateAuction: async (id, data) => {
    const res = await api.patch(`/api/auctions/${id}/`, data)
    return res.data
  },

  deleteAuction: async (id) => {
    const res = await api.delete(`/api/auctions/${id}/`)
    return res.data
  },

  placeBid: async (auctionId, cantidad) => {
    const res = await api.post("/api/auctions/bids/", {
      auction: auctionId,
      cantidad: cantidad
    })
    return res.data
  },

  getAuctionBids: async (auctionId) => {
    const res = await api.get(`/api/auctions/bids/por-subasta/${auctionId}/`)
    return res.data
  },

  closeAuction: async (id) => {
    const res = await api.post(`/api/auctions/${id}/close/`)
    return res.data
  }
}