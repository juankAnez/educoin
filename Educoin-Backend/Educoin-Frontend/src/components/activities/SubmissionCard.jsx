import React, { useState } from "react"

export default function SubmissionCard({ submission, onSave }) {
  const [editMode, setEditMode] = useState(false)
  const [calificacion, setCalificacion] = useState(submission.calificacion || "")
  const [retroalimentacion, setRetroalimentacion] = useState(submission.retroalimentacion || "")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ calificacion, retroalimentacion })
    setEditMode(false)
  }

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{submission.estudiante_nombre}</h3>
          <p className="text-sm text-gray-600">{submission.estudiante_email}</p>
        </div>
        {submission.archivo && (
          <a
            href={submission.archivo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline text-sm"
          >
            Ver archivo
          </a>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Calificación</label>
            <input
              type="number"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              step="0.1"
              min="0"
              max="100"
              className="w-full border rounded-lg px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Retroalimentación</label>
            <textarea
              value={retroalimentacion}
              onChange={(e) => setRetroalimentacion(e.target.value)}
              rows={2}
              className="w-full border rounded-lg px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600"
          >
            Guardar
          </button>
        </form>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-gray-700">
            Calificación: {submission.calificacion ?? "Sin calificar"}
          </p>
          <p className="text-sm text-gray-700">
            Retroalimentación: {submission.retroalimentacion || "—"}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="text-orange-600 text-sm mt-2 underline"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  )
}
