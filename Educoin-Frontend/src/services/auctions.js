import api from "./api"
import { API_ENDPOINTS } from "../utils/constants"

export const auctionService = {
  async getAll() {
    const res = await api.get(API_ENDPOINTS.AUCTIONS)
    return res.data
  },

  async getById(id) {
    const res = await api.get(API_ENDPOINTS.AUCTION_DETAIL(id))
    return res.data
  },

  async create(data) {
    const res = await api.post(API_ENDPOINTS.AUCTIONS, data)
    return res.data
  },

  async update(id, data) {
    const res = await api.patch(API_ENDPOINTS.AUCTION_DETAIL(id), data)
    return res.data
  },

  async remove(id) {
    const res = await api.delete(API_ENDPOINTS.AUCTION_DETAIL(id))
    return res.data
  },
}
