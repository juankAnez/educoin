import { useState } from "react"
import { useAuthContext } from "../../context/AuthContext"
import { useActivities } from "../../hooks/useActivities"
import Modal from "../../components/common/Modal"
import CreateActivity from "../../components/activities/CreateActivity"
import LoadingSpinner from "../../components/common/LoadingSpinner"

export default function ActivitiesPage() {
  const { user } = useAuthContext()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data: activities, isLoading } = useActivities()

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Actividades</h1>

        {user?.role === "docente" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            + Nueva Actividad
          </button>
        )}
      </div>

      {activities?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((a) => (
            <div key={a.id} className="border rounded-xl p-5 bg-white shadow-sm">
              <h3 className="font-semibold text-lg">{a.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{a.description}</p>
              <p className="text-sm text-gray-500 mt-2">Grupo: {a.group_name || "—"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No hay actividades disponibles en este momento
        </p>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear nueva actividad"
        size="lg"
      >
        <CreateActivity onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  )
}
