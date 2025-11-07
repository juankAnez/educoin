import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { 
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline"
import { useActivity, useActivitySubmissions } from "../../hooks/useActivities"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import SubmitActivityForm from "./SubmitActivityForm"
import SubmissionsList from "./SubmissionsList"
import { formatDate } from "../../utils/helpers"

export default function ActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { data: activity, isLoading } = useActivity(id)
  const { data: submissions } = useActivitySubmissions(id)
  const [showSubmitForm, setShowSubmitForm] = useState(false)

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
        
        {!isTeacher && !userSubmission && activity.habilitada && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            <DocumentArrowUpIcon className="h-5 w-5" />
            Entregar Actividad
          </button>
        )}
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

          {/* Info Grid - CORREGIDO EL VALOR EN NOTAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm">Fecha de Entrega</span>
              </div>
              <p className="font-semibold text-gray-900">
                {formatDate(activity.fecha_entrega)}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-orange-600 mb-1">
                <CurrencyDollarIcon className="h-5 w-5" />
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
                    ¡Actividad Entregada!
                  </h4>
                  <p className="text-sm text-green-700">
                    Entregaste esta actividad el {formatDate(userSubmission.creado)}
                  </p>
                  {userSubmission.calificacion && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-green-700">
                        <span className="font-semibold">Calificación:</span>{" "}
                        {userSubmission.calificacion}/5.0
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
    </div>
  )
}