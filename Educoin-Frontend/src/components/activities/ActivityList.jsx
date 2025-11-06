import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ClipboardDocumentListIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon 
} from "@heroicons/react/24/outline"
import { useActivities } from "../../hooks/useActivities"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import { formatDate } from "../../utils/helpers"

export default function ActivityList() {
  const { user } = useAuthContext()
  const { data: activities, isLoading } = useActivities()
  const [filter, setFilter] = useState("all")

  const isTeacher = user?.role === "docente"

  const filteredActivities = activities?.filter(activity => {
    if (filter === "all") return true
    if (filter === "pending") return !activity.submissions?.length
    if (filter === "completed") return activity.submissions?.length > 0
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "all"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todas
        </button>
        {!isTeacher && (
          <>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "pending"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "completed"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completadas
            </button>
          </>
        )}
      </div>

      {/* Activities Grid */}
      {filteredActivities && filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Link
              key={activity.id}
              to={`/activities/${activity.id}`}
              className="block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                    <span className="text-xs font-medium text-purple-100 uppercase">
                      {activity.tipo}
                    </span>
                  </div>
                  {activity.submissions?.length > 0 && (
                    <CheckCircleIcon className="h-5 w-5 text-green-300" />
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                  {activity.nombre}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-2">
                  {activity.descripcion || "Sin descripción"}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(activity.fecha_entrega)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-600 font-medium">
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span>{activity.valor_educoins} EC</span>
                  </div>
                </div>

                {!isTeacher && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.submissions?.length > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {activity.submissions?.length > 0 ? "Entregada" : "Pendiente"}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay actividades disponibles
          </h3>
          <p className="text-gray-500">
            {isTeacher
              ? "Comienza creando una actividad para tus grupos"
              : "Espera a que tu docente publique actividades"}
          </p>
        </div>
      )}
    </div>
  )
}