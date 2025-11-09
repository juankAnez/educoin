"use client"
import { useState } from "react"
import { useGradeSubmission } from "../../hooks/useSubmissions"
import LoadingSpinner from "../common/LoadingSpinner"

export default function GradeSubmissionModal({ submission, onClose }) {
  const [calificacion, setCalificacion] = useState("")
  const [retroalimentacion, setRetroalimentacion] = useState("")
  const grade = useGradeSubmission()

  const handleSubmit = (e) => {
    e.preventDefault()
    grade.mutate(
      { id: submission.id, data: { calificacion, retroalimentacion } },
      { onSuccess: onClose }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Calificación</label>
        <input
          type="number"
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Retroalimentación</label>
        <textarea
          value={retroalimentacion}
          onChange={(e) => setRetroalimentacion(e.target.value)}
          className="input"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={grade.isPending}
          className="btn-primary"
        >
          {grade.isPending ? <LoadingSpinner size="sm" /> : "Guardar"}
        </button>
      </div>
    </form>
  )
}
