import { Link } from "react-router-dom"
import {
  ClipboardDocumentListIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline"
import { formatDate } from "../../utils/helpers"

export default function ActivityCard({ activity, isTeacher, userSubmission }) {
  const isCompleted = !!userSubmission
  const isGraded = userSubmission?.calificacion !== null

  // Calcular días restantes
  const daysLeft = Math.ceil((new Date(activity.fecha_entrega) - new Date()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysLeft < 0

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-medium text-purple-100 uppercase bg-white/20 px-2 py-1 rounded">
                {activity.tipo}
              </span>
              <h3 className="font-bold text-white text-lg mt-1">
                {activity.nombre}
              </h3>
            </div>
          </div>
          {isCompleted && (
            <CheckCircleIcon className="h-6 w-6 text-green-300" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Clase y Grupo */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {activity.className} - {activity.groupName}
          </span>
        </div>
        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
          {activity.descripcion || "Sin descripción"}
        </p>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <CurrencyEuroIcon className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-gray-600">Educoins</span>
            </div>
            <p className="text-lg font-bold text-orange-600">
              {activity.valor_educoins} EC
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600">Valor Nota</span>
            </div>
            <p className="text-lg font-bold text-blue-600">
              {activity.valor_notas}
            </p>
          </div>
        </div>

        {/* Fecha límite */}
        <div className={`rounded-lg p-3 ${
          isOverdue 
            ? "bg-red-50 border border-red-200" 
            : daysLeft <= 3 
            ? "bg-yellow-50 border border-yellow-200" 
            : "bg-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className={`h-4 w-4 ${
                isOverdue ? "text-red-600" : daysLeft <= 3 ? "text-yellow-600" : "text-gray-600"
              }`} />
              <span className="text-sm text-gray-700">
                {formatDate(activity.fecha_entrega)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className={`h-4 w-4 ${
                isOverdue ? "text-red-600" : daysLeft <= 3 ? "text-yellow-600" : "text-gray-600"
              }`} />
              <span className={`text-xs font-medium ${
                isOverdue ? "text-red-600" : daysLeft <= 3 ? "text-yellow-600" : "text-gray-600"
              }`}>
                {isOverdue ? "Vencida" : `${daysLeft} días`}
              </span>
            </div>
          </div>
        </div>

        {/* Estado para estudiantes */}
        {!isTeacher && (
          <div className="pt-3 border-t border-gray-100">
            {isGraded ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Calificación:</span>
                <span className="text-lg font-bold text-green-600">
                  {userSubmission.calificacion}/5.0
                </span>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Entregada - Pendiente de calificación
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-700 font-medium">
                  Pendiente de entrega
                </span>
              </div>
            )}
          </div>
        )}

        {/* Info para docentes */}
        {isTeacher && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Entregas:</span>
              <span className="font-semibold text-gray-900">
                {activity.submissions?.length || 0}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5">
        <Link
          to={`/activities/${activity.id}`}
          className="w-full bg-purple-50 text-purple-600 px-4 py-2.5 rounded-lg hover:bg-purple-100 transition text-center text-sm font-medium group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center gap-2"
        >
          {isTeacher ? "Gestionar" : isCompleted ? "Ver Detalles" : "Entregar"}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}