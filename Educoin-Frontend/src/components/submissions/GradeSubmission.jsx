"use client"

import { useState } from "react"
import { useGradeSubmission } from "../../hooks/useSubmissions"
import LoadingSpinner from "../common/LoadingSpinner"

export default function GradeSubmission({ submission, onClose }) {
  const gradeSubmission = useGradeSubmission()
  const [formData, setFormData] = useState({
    calificacion: submission?.calificacion || "",
    retroalimentacion: submission?.retroalimentacion || "",
    educoins: submission?.educoins || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.calificacion || !formData.educoins) return

    await gradeSubmission.mutateAsync({
      submissionId: submission.id,
      calificacion: parseFloat(formData.calificacion),
      retroalimentacion: formData.retroalimentacion,
      educoins: parseInt(formData.educoins),
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Calificación (1-5)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          name="calificacion"
          value={formData.calificacion}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Retroalimentación</label>
        <textarea
          name="retroalimentacion"
          rows={3}
          value={formData.retroalimentacion}
          onChange={handleChange}
          className="input"
          placeholder="Buen trabajo, pero podrías mejorar en..."
        />
      </div>

      <div>
        <label className="label">Educoins a otorgar</label>
        <input
          type="number"
          min="0"
          name="educoins"
          value={formData.educoins}
          onChange={handleChange}
          className="input"
          placeholder="Ej: 50"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={gradeSubmission.isPending}
          className="btn-primary"
        >
          {gradeSubmission.isPending ? <LoadingSpinner size="sm" /> : "Guardar Calificación"}
        </button>
      </div>
    </form>
  )
}
