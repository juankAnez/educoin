"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { useActivity, useCompleteActivity, useDeleteActivity, useAssignCoins } from "../../hooks/useActivities"
import { useAuth } from "../../hooks/useAuth"
import { formatDate, formatCoins } from "../../utils/helpers"
import { ACTIVITY_STATUS } from "../../utils/constants"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import CreateActivity from "./CreateActivity"

const ActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isTeacher, isStudent } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignCoins, setAssignCoins] = useState("")

  const { data: activity, isLoading, error } = useActivity(id)
  const completeActivity = useCompleteActivity()
  const deleteActivity = useDeleteActivity()
  const assignCoinsToStudent = useAssignCoins()

  const handleComplete = async () => {
    try {
      await completeActivity.mutateAsync(id)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleDelete = async () => {
    try {
      await deleteActivity.mutateAsync(id)
      navigate("/activities")
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleAssignCoins = async (e) => {
    e.preventDefault()
    if (!assignCoins || assignCoins <= 0) return

    try {
      await assignCoinsToStudent.mutateAsync({
        activityId: id,
        studentId: user.id,
        coins: Number.parseInt(assignCoins),
      })
      setShowAssignModal(false)
      setAssignCoins("")
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case ACTIVITY_STATUS.COMPLETED:
        return "text-green-600 bg-green-100"
      case ACTIVITY_STATUS.ACTIVE:
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case ACTIVITY_STATUS.COMPLETED:
        return "Completada"
      case ACTIVITY_STATUS.ACTIVE:
        return "Activa"
      default:
        return "Pendiente"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Fácil"
      case "medium":
        return "Medio"
      case "hard":
        return "Difícil"
      default:
        return "No especificada"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar la actividad: {error?.message || "Actividad no encontrada"}</p>
        <Link to="/activities" className="btn-primary mt-4">
          Volver a Actividades
        </Link>
      </div>
    )
  }

  const canComplete = isStudent && activity.status === ACTIVITY_STATUS.ACTIVE
  const canEdit = isTeacher

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/activities")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
            <p className="text-gray-600">{activity.group_name || activity.group?.name}</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex space-x-2">
            <button onClick={() => setShowEditModal(true)} className="btn-outline">
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="btn bg-red-600 text-white hover:bg-red-700">
              <TrashIcon className="h-4 w-4 mr-2" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Activity Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Descripción</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{activity.description}</p>
          </div>

          {/* Actions */}
          {(canComplete || canEdit) && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              <div className="flex space-x-3">
                {canComplete && (
                  <button onClick={handleComplete} disabled={completeActivity.isPending} className="btn-primary flex-1">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    {completeActivity.isPending ? "Completando..." : "Completar Actividad"}
                  </button>
                )}
                {isTeacher && (
                  <button onClick={() => setShowAssignModal(true)} className="btn-outline flex-1">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    Asignar Educoins
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`badge ${getStatusColor(activity.status)}`}>{getStatusText(activity.status)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recompensa:</span>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium text-blue-600">{formatCoins(activity.reward_coins)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Dificultad:</span>
                <span className={`badge ${getDifficultyColor(activity.difficulty)}`}>
                  {getDifficultyText(activity.difficulty)}
                </span>
              </div>

              {activity.due_date && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vencimiento:</span>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">{formatDate(activity.due_date)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Grupo:</span>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm">{activity.group_name || activity.group?.name}</span>
                </div>
              </div>

              {activity.created_at && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Creada:</span>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">{formatDate(activity.created_at)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Actividad" size="lg">
        <CreateActivity activity={activity} onClose={() => setShowEditModal(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar la actividad "{activity.title}"? Esta acción no se puede deshacer.
          </p>
          <div className="flex space-x-3 justify-end">
            <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteActivity.isPending}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              {deleteActivity.isPending ? <LoadingSpinner size="sm" /> : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Coins Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Asignar Educoins" size="sm">
        <form onSubmit={handleAssignCoins} className="space-y-4">
          <div>
            <label htmlFor="coins" className="label">
              Cantidad de Educoins
            </label>
            <input
              type="number"
              id="coins"
              value={assignCoins}
              onChange={(e) => setAssignCoins(e.target.value)}
              className="input"
              placeholder="Ej: 50"
              min="1"
              required
            />
          </div>
          <div className="flex space-x-3 justify-end">
            <button type="button" onClick={() => setShowAssignModal(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={assignCoinsToStudent.isPending} className="btn-primary">
              {assignCoinsToStudent.isPending ? <LoadingSpinner size="sm" /> : "Asignar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ActivityDetail
