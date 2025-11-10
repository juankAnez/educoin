"use client"

import { useState } from "react"
import { CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { usePlaceBid } from "../../hooks/useAuctions"
import { formatCoins } from "../../utils/helpers"
import LoadingSpinner from "../common/LoadingSpinner"

const BidForm = ({ auction, userBalance = 0 }) => {
  const placeBid = usePlaceBid()
  const [bidAmount, setBidAmount] = useState("")
  const [error, setError] = useState("")

  const currentBid = auction.current_bid || auction.starting_price
  const minBid = currentBid + 1

  const handleSubmit = async (e) => {
    e.preventDefault()

    const amount = Number.parseInt(bidAmount)

    if (!amount || amount < minBid) {
      setError(`La puja mínima es ${formatCoins(minBid)}`)
      return
    }

    if (amount > userBalance) {
      setError("No tienes suficientes Educoins")
      return
    }

    try {
      await placeBid.mutateAsync({ auctionId: auction.id, amount })
      setBidAmount("")
      setError("")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleChange = (e) => {
    setBidAmount(e.target.value)
    if (error) {
      setError("")
    }
  }

  const isActive = auction.status === "activo"
  const hasEnded = new Date(auction.end_date) < new Date()

  if (!isActive || hasEnded) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="text-center py-4">
          <p className="text-gray-500">Esta subasta ha finalizado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Realizar Puja</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Puja actual:</span>
          <span className="font-medium text-green-600">{formatCoins(currentBid)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Puja mínima:</span>
          <span className="font-medium text-orange-600">{formatCoins(minBid)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tu balance:</span>
          <span className="font-medium text-orange-900">{formatCoins(userBalance)}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Tu Puja
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
                placeholder={minBid.toString()}
                min={minBid}
                max={userBalance}
                required
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={placeBid.isPending || !bidAmount || userBalance < minBid}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {placeBid.isPending ? <LoadingSpinner size="sm" /> : "Realizar Puja"}
          </button>

          {userBalance < minBid && (
            <p className="text-sm text-red-600 text-center">No tienes suficientes Educoins para pujar</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default BidForm