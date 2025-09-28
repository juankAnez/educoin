"use client"

import { Link } from "react-router-dom"
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  FireIcon,
} from "@heroicons/react/24/outline"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useAuth } from "../../hooks/useAuth"
import { formatCoins, formatDateTime, truncateText } from "../../utils/helpers"
import { AUCTION_STATUS } from "../../utils/constants"

const AuctionCard = ({ auction, onEdit, onDelete }) => {
  const { isTeacher } = useAuth()

  const getStatusColor = (status) => {
    switch (status) {
      case AUCTION_STATUS.ACTIVE:
        return "badge-success"
      case AUCTION_STATUS.FINISHED:
        return "badge-error"
      default:
        return "badge-warning"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case AUCTION_STATUS.ACTIVE:
        return "Activa"
      case AUCTION_STATUS.FINISHED:
        return "Finalizada"
      default:
        return "Pendiente"
    }
  }

  const isActive = auction.status === AUCTION_STATUS.ACTIVE
  const timeRemaining = new Date(auction.end_date) - new Date()
  const isEndingSoon = timeRemaining > 0 && timeRemaining < 24 * 60 * 60 * 1000 // Less than 24 hours

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
            {isEndingSoon && isActive && (
              <div className="flex items-center text-red-600 text-sm">
                <FireIcon className="h-4 w-4 mr-1" />
                <span>¡Termina pronto!</span>
              </div>
            )}
          </div>
        </div>

        {isTeacher() && (
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(auction)}
                      className={`group flex w-full items-center px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <PencilIcon className="mr-3 h-4 w-4" />
                      Editar
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(auction)}
                      className={`group flex w-full items-center px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-red-900" : "text-red-700"
                      }`}
                    >
                      <TrashIcon className="mr-3 h-4 w-4" />
                      Eliminar
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>

      {/* Auction Image */}
      {auction.image && (
        <div className="mb-4">
          <img
            src={auction.image || "/placeholder.svg?height=200&width=300&query=auction item"}
            alt={auction.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <p className="text-gray-600 mb-4">{truncateText(auction.description, 120)}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1 text-educoin-500" />
            <span className="text-sm text-gray-600">Precio inicial:</span>
          </div>
          <span className="text-sm font-medium text-educoin-600">{formatCoins(auction.starting_price)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-sm text-gray-600">Puja actual:</span>
          </div>
          <span className="text-sm font-bold text-green-600">
            {formatCoins(auction.current_bid || auction.starting_price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-sm text-gray-600">Termina:</span>
          </div>
          <span className="text-sm text-gray-500">{formatDateTime(auction.end_date)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`badge ${getStatusColor(auction.status)}`}>{getStatusText(auction.status)}</span>
        <span className="text-sm text-gray-500">{auction.bid_count || 0} pujas</span>
      </div>

      <Link to={`/auctions/${auction.id}`} className="btn-primary w-full text-center">
        {isActive ? "Ver y Pujar" : "Ver Detalles"}
      </Link>
    </div>
  )
}

export default AuctionCard
