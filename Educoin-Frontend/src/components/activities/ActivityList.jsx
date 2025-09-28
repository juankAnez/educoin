"use client"

import { useState } from "react"
import { MagnifyingGlassIcon, PlusIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline"
import ActivityCard from "./ActivityCard"
import CreateActivity from "./CreateActivity"
import { useAuth } from "../../hooks/useAuth"
import { useActivities, useDeleteActivity } from "../../hooks/useActivities"
import { useGroups } from "../../hooks/useGroups"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import { debounce } from "../../utils/helpers"
import { ACTIVITY_STATUS } from "../../utils/constants"

const ActivityList = () => {
  const { isTeacher } = useAuth()
  const [filters, setFilters] = useState({
    search: "",
    group: "",
    status: "",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [deletingActivity, setDeletingActivity] = useState(null)

  const { data: activities, isLoading, error } = useActivities(filters)
  const { data: groups } = useGroups()
  const deleteActivity = useDeleteActivity()

  const debouncedSearch = debounce((term) => {
    setFilters((prev) => ({ ...prev, search: term }))
  }, 300)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setShowCreateModal(true)
  }

  const handleDelete = (activity) => {
    setDeletingActivity(activity)
  }

  const confirmDelete = async () => {
    if (deletingActivity) {
      await deleteActivity.mutateAsync(deletingActivity.id)
      setDeletingActivity(null)
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingActivity(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar las actividades: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actividades</h1>
          <p className="text-gray-600">
            {isTeacher() ? "Gestiona las actividades de tus grupos" : "Completa actividades y gana Educoins"}
          </p>
        </div>
        {isTeacher() && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Actividad
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              className="input pl-10"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          <select value={filters.group} onChange={(e) => handleFilterChange("group", e.target.value)} className="input">
            <option value="">Todos los grupos</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="input"
          >
            <option value="">Todos los estados</option>
            <option value={ACTIVITY_STATUS.ACTIVE}>Activas</option>
            <option value={ACTIVITY_STATUS.COMPLETED}>Completadas</option>
            <option value={ACTIVITY_STATUS.PENDING}>Pendientes</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {activities?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron actividades</h3>
          <p className="text-gray-500 mb-4">
            {isTeacher()
              ? "Crea tu primera actividad para comenzar a motivar a tus estudiantes"
              : "No hay actividades disponibles en este momento"}
          </p>
          {isTeacher() && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Actividad
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingActivity ? "Editar Actividad" : "Nueva Actividad"}
        size="lg"
      >
        <CreateActivity activity={editingActivity} onClose={handleCloseModal} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingActivity}
        onClose={() => setDeletingActivity(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar la actividad "{deletingActivity?.title}"? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex space-x-3 justify-end">
            <button onClick={() => setDeletingActivity(null)} className="btn-secondary">
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteActivity.isPending}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              {deleteActivity.isPending ? <LoadingSpinner size="sm" /> : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ActivityList
