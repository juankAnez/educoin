import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { 
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  PencilIcon,
  DocumentTextIcon
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
      <div className="text-center py-12">
        <p className="text-red-600">Actividad no encontrada</p>
        <button onClick={() => navigate("/activities")} className="btn-primary mt-4">
          Volver a Actividades
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/activities")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Volver</span>
        </button>
        
        <div className="flex gap-3">
          {isTeacher && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <PencilIcon className="h-5 w-5" />
              Editar Actividad
            </button>
          )}
          
          {!isTeacher && !userSubmission && activity.habilitada && !activity.esta_vencida && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
              Entregar Actividad
            </button>
          )}
        </div>
      </div>

      {/* Activity Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium uppercase bg-white/20 px-2 py-1 rounded">
                {activity.tipo}
              </span>
              <h1 className="text-2xl font-bold mt-2">{activity.nombre}</h1>
            </div>
            {userSubmission && (
              <CheckCircleIcon className="h-8 w-8 text-green-300" />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {activity.descripcion || "Sin descripción"}
            </p>
          </div>

          {/* Archivo Adjunto del Docente */}
          {activity.archivo_adjunto && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Material Adjunto
              </h3>
              <a
                href={activity.archivo_adjunto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                Ver archivo adjunto del docente
              </a>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm">Fecha de Entrega</span>
              </div>
              <p className="font-semibold text-gray-900">
                {formatDate(activity.fecha_entrega)}
              </p>
              {activity.esta_vencida && (
                <span className="text-xs text-red-600 mt-1 block">Vencida</span>
              )}
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-orange-600 mb-1">
                <CurrencyEuroIcon className="h-5 w-5" />
                <span className="text-sm">Valor en Educoins</span>
              </div>
              <p className="font-semibold text-orange-600 text-xl">
                {activity.valor_educoins} EC
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 mb-1">Valor en Notas</div>
              <p className="font-semibold text-blue-600 text-xl">
                {activity.valor_notas}
              </p>
            </div>
          </div>

          {/* Student Submission Status */}
          {!isTeacher && userSubmission && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-1">
                    Actividad Entregada
                  </h4>
                  <p className="text-sm text-green-700">
                    Entregaste esta actividad el {formatDate(userSubmission.creado)}
                  </p>
                  {userSubmission.calificacion !== null && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-green-700">
                        <span className="font-semibold">Calificación:</span>{" "}
                        {userSubmission.calificacion}/{activity.valor_notas}
                      </p>
                      {userSubmission.retroalimentacion && (
                        <p className="text-sm text-green-700 mt-1">
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Esta actividad ha vencido. Ya no es posible realizar entregas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submissions List (Teacher View) */}
      {isTeacher && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Entregas de Estudiantes ({submissions?.length || 0})
          </h2>
          <SubmissionsList submissions={submissions} activityId={id} />
        </div>
      )}

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <SubmitActivityForm
          activityId={id}
          onClose={() => setShowSubmitForm(false)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditActivityModal
          activity={activity}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}