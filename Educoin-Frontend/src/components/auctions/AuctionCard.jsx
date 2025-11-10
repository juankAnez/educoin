import { Link } from "react-router-dom"
import { 
  ShoppingBagIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"

const AuctionCard = ({ auction, onEdit, onDelete, onClose }) => {
  const { user } = useAuthContext()
  const isTeacher = user?.role === "docente"

  const isActive = auction.estado === "active"
  const isClosed = auction.estado === "closed"
  const fechaFin = new Date(auction.fecha_fin)
  const now = new Date()
  const timeRemaining = fechaFin - now
  const isEndingSoon = timeRemaining > 0 && timeRemaining < 24 * 60 * 60 * 1000
  const hasEnded = timeRemaining <= 0
  const isExpired = isActive && hasEnded

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemainingText = () => {
    if (isClosed) return "Finalizada"
    if (hasEnded) return "Tiempo agotado"
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h`
    
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}m`
  }

  const winnerInfo = auction.puja_ganadora

  return (
    <div className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
      isActive ? 'border-green-200' : 'border-gray-200'
    }`}>
      {/* Header - Verde para detalles principales */}
      <div className={`p-5 text-white ${
        isActive 
          ? 'bg-gradient-to-r from-green-500 to-green-600' 
          : 'bg-gradient-to-r from-gray-500 to-gray-600'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg line-clamp-2">{auction.titulo}</h3>
              <p className="text-green-100 text-sm mt-1">
                {auction.grupo_nombre || auction.grupo?.nombre}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={`px-3 py-1 rounded-full font-medium ${
            isActive ? 'bg-green-500/20' : 'bg-gray-500/20'
          }`}>
            {isActive ? 'Activa' : 'Cerrada'}
          </span>
          {isActive && !hasEnded && (
            <div className="text-right">
              <p className="opacity-75">Tiempo restante</p>
              <p className={`font-bold ${isEndingSoon ? 'text-red-300' : 'text-green-100'}`}>
                {getTimeRemainingText()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
          {auction.descripcion || "Sin descripción disponible"}
        </p>

        {/* Info Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estado:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? "bg-green-100 text-green-700" : 
              isClosed ? "bg-gray-100 text-gray-700" : 
              "bg-red-100 text-red-700"
            }`}>
              {isActive ? "Activa" : isClosed ? "Cerrada" : "Expirada"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <ClockIcon className="h-4 w-4" />
              <span>{isClosed ? "Finalizó:" : "Finaliza:"}</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-900">
                {formatDateTime(auction.fecha_fin)}
              </span>
              {isActive && !hasEnded && (
                <div className={`text-xs ${isEndingSoon ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                  {getTimeRemainingText()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <UserGroupIcon className="h-4 w-4" />
              <span>Pujas:</span>
            </div>
            <span className="font-bold text-orange-600">{auction.total_pujas || 0}</span>
          </div>

          {isTeacher && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Creada por:</span>
              <span className="text-gray-900 font-medium">
                {auction.creador_nombre || auction.creador?.first_name || 'Tú'}
              </span>
            </div>
          )}

          {/* Ganador si está cerrada - Verde para detalles del ganador */}
          {isClosed && winnerInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-green-700 font-medium">Ganador:</span>
                <span className="text-green-900 font-semibold">
                  {winnerInfo.estudiante_nombre}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">Puja ganadora:</span>
                <span className="text-green-800 font-bold">
                  {winnerInfo.cantidad} EC
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          to={`/auctions/${auction.id}`}
          className="flex-1 bg-green-50 text-green-600 px-4 py-2.5 rounded-lg hover:bg-green-100 transition text-center text-sm font-medium"
        >
          {isTeacher ? "Gestionar" : "Ver Detalles"}
        </Link>
        
        {isTeacher && (
          <>
            <button
              onClick={() => onEdit(auction)}
              disabled={isClosed}
              className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title={isClosed ? "No se puede editar subastas cerradas" : "Editar subasta"}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            
            {isActive && (
              <button
                onClick={() => onClose(auction.id)}
                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                title="Cerrar subasta manualmente"
              >
                Cerrar
              </button>
            )}
            
            <button
              onClick={() => onDelete(auction.id)}
              disabled={isClosed}
              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title={isClosed ? "No se puede eliminar subastas cerradas" : "Eliminar subasta"}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AuctionCard