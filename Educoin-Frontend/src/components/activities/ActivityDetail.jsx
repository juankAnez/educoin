import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { 
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  PencilIcon,
  DocumentTextIcon,
  ClockIcon
} from "@heroicons/react/24/outline"
import { useActivity, useActivitySubmissions } from "../../hooks/useActivities"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import SubmitActivityForm from "./SubmitActivityForm"
import SubmissionsList from "./SubmissionsList"
import EditActivityModal from "./EditActivityModal"
import { formatDate } from "../../utils/helpers"

export default function ActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { data: activity, isLoading } = useActivity(id)
  const { data: submissions } = useActivitySubmissions(id)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const isTeacher = user?.role === "docente"
  const userSubmission = submissions?.find(s => s.estudiante === user?.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-red-600 text-lg mb-4">Actividad no encontrada</p>
        <button 
          onClick={() => navigate("/activities")} 
          className="bg-purple-500 text-white px-6 py-2.5 rounded-lg hover:bg-purple-600 transition font-medium"
        >
          Volver a Actividades
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/activities")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-fit"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm sm:text-base">Volver</span>
        </button>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {isTeacher && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2.5 rounded-lg hover:bg-purple-600 transition text-sm sm:text-base order-2 sm:order-1"
            >
              <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Editar Actividad
            </button>
          )}
          
          {!isTeacher && !userSubmission && activity.habilitada && !activity.esta_vencida && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2.5 rounded-lg hover:bg-purple-600 transition text-sm sm:text-base order-1 sm:order-2"
            >
              <DocumentArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Entregar Actividad
            </button>
          )}
        </div>
      </div>

      {/* Activity Card */}
      <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 sm:p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium uppercase bg-white/20 px-2 py-1 rounded">
                {activity.tipo}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2 sm:mt-3">
                {activity.nombre}
              </h1>
            </div>
            {userSubmission && (
              <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-300 flex-shrink-0 ml-2" />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
              Descripción
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap text-sm sm:text-base">
              {activity.descripcion || "Sin descripción"}
            </p>
          </div>

          {/* Archivo Adjunto del Docente */}
          {activity.archivo_adjunto && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-purple-900 text-sm sm:text-base mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Material Adjunto
              </h3>
              <a
                href={activity.archivo_adjunto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:underline text-sm sm:text-base"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                Ver archivo adjunto del docente
              </a>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Fecha de Entrega</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">
                {formatDate(activity.fecha_entrega)}
              </p>
              {activity.esta_vencida && (
                <span className="text-xs text-red-600 mt-1 block">Vencida</span>
              )}
            </div>

            <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-orange-600 mb-1">
                <CurrencyEuroIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Valor en Educoins</span>
              </div>
              <p className="font-semibold text-orange-600 text-lg sm:text-xl">
                {activity.valor_educoins} EC
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-blue-600 mb-1">Valor en Notas</div>
              <p className="font-semibold text-blue-600 text-lg sm:text-xl">
                {activity.valor_notas}
              </p>
            </div>
          </div>

          {/* Student Submission Status */}
          {!isTeacher && userSubmission && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 text-sm sm:text-base mb-1">
                    Actividad Entregada
                  </h4>
                  <p className="text-xs sm:text-sm text-green-700">
                    Entregaste esta actividad el {formatDate(userSubmission.creado)}
                  </p>
                  {userSubmission.calificacion !== null && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-200">
                      <p className="text-xs sm:text-sm text-green-700">
                        <span className="font-semibold">Calificación:</span>{" "}
                        {userSubmission.calificacion}/{activity.valor_notas}
                      </p>
                      {userSubmission.retroalimentacion && (
                        <p className="text-xs sm:text-sm text-green-700 mt-1">
                          <span className="font-semibold">Retroalimentación:</span>{" "}
                          {userSubmission.retroalimentacion}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning si está vencida */}
          {!isTeacher && !userSubmission && activity.esta_vencida && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <p className="text-red-700 text-xs sm:text-sm">
                Esta actividad ha vencido. Ya no es posible realizar entregas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submissions List (Teacher View) */}
      {isTeacher && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Entregas de Estudiantes ({submissions?.length || 0})
          </h2>
          <SubmissionsList submissions={submissions} activityId={id} />
        </div>
      )}

      {/* Modals */}
      {showSubmitForm && (
        <SubmitActivityForm
          activityId={id}
          onClose={() => setShowSubmitForm(false)}
        />
      )}

      {showEditModal && (
        <EditActivityModal
          activity={activity}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}