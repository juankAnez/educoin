"use client"

import React, { useState } from "react"
import { useAuthContext } from "../../context/AuthContext"
import ActivitiesList from "../../components/activities/ActivityList"
import CreateActivity from "../../components/activities/CreateActivity"
import Modal from "../../components/common/Modal"

export default function ActivitiesPage() {
  const { user } = useAuthContext()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const isTeacher = user?.role === "docente"
  const isStudent = user?.role === "estudiante"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isTeacher ? "Gestión de Actividades" : "Actividades Asignadas"}
          </h1>
          <p className="text-gray-600">
            {isTeacher
              ? "Crea, gestiona y califica las actividades de tus grupos."
              : "Consulta tus actividades, entrega tus trabajos y revisa tus calificaciones."}
          </p>
        </div>

        {/* Solo el docente puede crear actividades */}
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            + Nueva Actividad
          </button>
        )}
      </div>

      {/* Listado de actividades */}
      <ActivitiesList />

      {/* Modal para crear actividad (solo docente) */}
      {isTeacher && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear nueva actividad"
          size="lg"
        >
          <CreateActivity onClose={() => setShowCreateModal(false)} />
        </Modal>
      )}
    </div>
  )
}
