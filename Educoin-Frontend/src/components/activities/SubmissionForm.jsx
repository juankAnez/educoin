"use client"

import { useState } from "react"
import { useCreateSubmission } from "../../hooks/useSubmissions"
import LoadingSpinner from "../common/LoadingSpinner"

const SubmissionForm = ({ activityId }) => {
  const [contenido, setContenido] = useState("")
  const [archivo, setArchivo] = useState(null)
  const createSubmission = useCreateSubmission()

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("activity", activityId)
    formData.append("contenido", contenido)
    if (archivo) formData.append("archivo", archivo)

    createSubmission.mutate(formData)
    setContenido("")
    setArchivo(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder="Escribe tu respuesta..."
        className="input w-full"
        required
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="block text-sm text-gray-700"
      />

      <button
        type="submit"
        disabled={createSubmission.isPending}
        className="btn-primary w-full"
      >
        {createSubmission.isPending ? <LoadingSpinner size="sm" /> : "Enviar entrega"}
      </button>
    </form>
  )
}

export default SubmissionForm
