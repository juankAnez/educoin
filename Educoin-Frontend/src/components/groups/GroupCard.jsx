"use client"

import { useState } from "react"
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import { useDeleteGroup } from "../../hooks/useGroups"
import Modal from "../common/Modal"
import CreateGroup from "./CreateGroup"
import AddStudentToGroup from "./AddStudentToGroup"
import LoadingSpinner from "../common/LoadingSpinner" // Import LoadingSpinner

const GroupCard = ({ group, onEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const deleteGroup = useDeleteGroup()

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(group.id)
      setShowDeleteConfirm(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isActive = !group.is_closed && new Date(group.end_date) > new Date()
  const studentCount = group.student_groups?.filter((sg) => sg.active)?.length || 0

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {isActive ? "Activo" : "Cerrado"}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-4 w-4" />
                <span>
                  {studentCount} / {group.max_students} estudiantes
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>{group.coin_limit} Educoins disponibles</span>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {formatDate(group.start_date)} - {formatDate(group.end_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowAddStudentModal(true)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Agregar Estudiante
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(true)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for students */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Estudiantes inscritos</span>
            <span>{Math.round((studentCount / group.max_students) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((studentCount / group.max_students) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Grupo">
        <CreateGroup group={group} onClose={() => setShowEditModal(false)} />
      </Modal>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="Agregar Estudiante al Grupo"
      >
        <AddStudentToGroup group={group} onClose={() => setShowAddStudentModal(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar el grupo "{group.name}"? Esta acción no se puede deshacer.
          </p>
          <div className="flex space-x-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={deleteGroup.isPending} className="btn-danger flex-1">
              {deleteGroup.isPending ? <LoadingSpinner size="sm" /> : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default GroupCard
