import { Link } from "react-router-dom"
import { ShoppingBagIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"
import { formatDate } from "../../utils/helpers"

const AuctionCard = ({ auction, onEdit, onDelete, onClose }) => {
  const { user } = useAuthContext()
  const isTeacher = user?.role === "docente"

  const isActive = auction.estado === "active"
  const timeRemaining = new Date(auction.fecha_fin) - new Date()
  const isEndingSoon = timeRemaining > 0 && timeRemaining < 24 * 60 * 60 * 1000

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{auction.titulo}</h3>
              {isEndingSoon && isActive && (
                <span className="text-xs text-yellow-300">Termina pronto</span>
              )}
            </div>
          </div>
          {!isActive && <CheckCircleIcon className="h-6 w-6 text-green-300" />}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
          {auction.descripcion || "Sin descripción"}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estado:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}>
              {isActive ? "Activa" : "Cerrada"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              <span>Finaliza:</span>
            </div>
            <span className="text-gray-900 font-medium">{formatDate(auction.fecha_fin)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total de pujas:</span>
            <span className="font-bold text-purple-600">{auction.total_pujas || 0}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex gap-2">
        <Link
          to={`/auctions/${auction.id}`}
          className="flex-1 bg-purple-50 text-purple-600 px-4 py-2.5 rounded-lg hover:bg-purple-100 transition text-center text-sm font-medium"
        >
          Ver Detalles
        </Link>
        
        {isTeacher && (
          <>
            <button
              onClick={() => onEdit(auction)}
              className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
            >
              Editar
            </button>
            
            {isActive && (
              <button
                onClick={() => onClose(auction.id)}
                className="px-4 py-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
              >
                Cerrar
              </button>
            )}
            
            <button
              onClick={() => onDelete(auction.id)}
              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AuctionCard