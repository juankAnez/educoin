"use client"

import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline"
import { formatCoins } from "../../utils/helpers"

const CoinBalance = ({ balance = 0, totalEarned = 0, totalSpent = 0, className = "" }) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Balance de Educoins</h3>
        <div className="p-2 bg-educoin-100 rounded-lg">
          <CurrencyDollarIcon className="h-6 w-6 text-educoin-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Balance */}
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold text-educoin-600">{formatCoins(balance)}</p>
          <p className="text-sm text-gray-500 mt-1">Balance actual</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-lg font-semibold text-green-600">{formatCoins(totalEarned)}</span>
            </div>
            <p className="text-sm text-gray-500">Total ganado</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-lg font-semibold text-red-600">{formatCoins(totalSpent)}</span>
            </div>
            <p className="text-sm text-gray-500">Total gastado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoinBalance
