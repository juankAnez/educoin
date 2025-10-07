"use client"

import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"
import { useActivity } from "../../hooks/useActivities"
import { useSubmissions } from "../../hooks/useSubmissions"
import LoadingSpinner from "../common/LoadingSpinner"
import SubmissionCard from "./SubmissionCard.jsx"

export default function ActivityDetail() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { data: activity, isLoading: loadingActivity } = useActivity(id)
  const {
    submissions,
    isLoading: loadingSubmissions,
    createSubmission,
    updateSubmission,
  } = useSubmissions(id)

  const [contenido, setContenido] = useState("")
  const [archivo, setArchivo] = useState(null)

  const handleFileChange = (e) => setArchivo(e.target.files[0])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append("activity", id)
    form.append("contenido", contenido)
    if (archivo) form.append("archivo", archivo)

    try {
      await createSubmission(form)
      setContenido("")
      setArchivo(null)
    } catch (error) {
      console.error(error)
    }
  }

  if (loadingActivity || loadingSubmissions)
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{activity.nombre}</h1>
        <p className="text-gray-600">{activity.descripcion}</p>
        <p className="text-sm text-gray-500 mt-2">
          Entrega hasta: {new Date(activity.fecha_entrega).toLocaleDateString()}
        </p>
      </div>

      {user?.role === "estudiante" && (
        <div className="card border p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Enviar tu entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              name="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={4}
              placeholder="Escribe una nota o descripción..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              className="w-full text-sm border rounded-lg p-2"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Enviar Submission
            </button>
          </form>
        </div>
      )}

      {user?.role === "docente" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Submissions de estudiantes
          </h2>
          {submissions.length ? (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  onSave={(data) => updateSubmission({ id: sub.id, data })}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no hay submissions para esta actividad.</p>
          )}
        </div>
      )}
    </div>
  )
}
