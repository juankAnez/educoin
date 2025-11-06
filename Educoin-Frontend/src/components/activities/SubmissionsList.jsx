import { useState } from "react"
import { useGradeSubmission } from "../../hooks/useActivities"
import { UserCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import { formatDate } from "../../utils/helpers"

export default function SubmissionsList({ submissions, activityId }) {
  const gradeMutation = useGradeSubmission()
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [gradeData, setGradeData] = useState({
    nota: "",
    retroalimentacion: ""
  })

  const handleGrade = async (submissionId) => {
    try {
      await gradeMutation.mutateAsync({
        id: submissionId,
        data: {
          nota: parseFloat(gradeData.nota),
          retroalimentacion: gradeData.retroalimentacion
        }
      })
      setSelectedSubmission(null)
      setGradeData({ nota: "", retroalimentacion: "" })
    } catch (error) {
      console.error("Error calificando:", error)
    }
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay entregas aún
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {submission.estudiante_nombre || "Estudiante"}
                </h4>
                <p className="text-sm text-gray-500">
                  Entregado el {formatDate(submission.creado)}
                </p>
                
                {submission.contenido && (
                  <p className="text-sm text-gray-700 mt-2">
                    {submission.contenido}
                  </p>
                )}

                {submission.archivo && (
                  <a
                    href={submission.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>Ver archivo adjunto</span>
                  </a>
                )}
              </div>
            </div>

            <div className="text-right">
              {submission.calificacion ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">
                    {submission.calificacion}/5.0
                  </div>
                  {submission.retroalimentacion && (
                    <p className="text-xs text-gray-500 max-w-xs">
                      {submission.retroalimentacion}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedSubmission(submission.id)
                    setGradeData({
                      nota: submission.calificacion || "",
                      retroalimentacion: submission.retroalimentacion || ""
                    })
                  }}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
                >
                  Calificar
                </button>
              )}
            </div>
          </div>

          {/* Grade Form */}
          {selectedSubmission === submission.id && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nota (0-5) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={gradeData.nota}
                    onChange={(e) => setGradeData({...gradeData, nota: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retroalimentación
                </label>
                <textarea
                  value={gradeData.retroalimentacion}
                  onChange={(e) => setGradeData({...gradeData, retroalimentacion: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Comentarios para el estudiante..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleGrade(submission.id)}
                  disabled={!gradeData.nota || gradeMutation.isPending}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm disabled:opacity-50"
                >
                  {gradeMutation.isPending ? "Guardando..." : "Guardar Calificación"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}