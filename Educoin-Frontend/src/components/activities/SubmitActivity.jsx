"use client"
import { useState } from "react"
import { useCreateSubmission } from "../../hooks/useSubmissions"
import LoadingSpinner from "../common/LoadingSpinner"

export default function SubmitActivity({ activityId }) {
  const [contenido, setContenido] = useState("")
  const createSubmission = useCreateSubmission()

  const handleSubmit = (e) => {
    e.preventDefault()
    createSubmission.mutate({
      activity: activityId,
      contenido,
    })
    setContenido("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder="Escribe tu respuesta..."
        className="input w-full"
        required
      />
      <button
        type="submit"
        disabled={createSubmission.isPending}
        className="btn-primary"
      >
        {createSubmission.isPending ? <LoadingSpinner size="sm" /> : "Enviar Entrega"}
      </button>
    </form>
  )
}
