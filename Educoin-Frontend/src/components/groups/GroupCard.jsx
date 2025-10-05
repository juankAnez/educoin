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
import Modal from "../common/Modal"
import CreateGroup from "./CreateGroup"
import AddStudentToGroup from "./AddStudentToGroup"
import { useDeleteGroup } from "../../hooks/useGroups"
import LoadingSpinner from "../common/LoadingSpinner"

const GroupCard = ({ group, onEdit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const deleteGroup = useDeleteGroup()

  const isActive = !group.is_closed && new Date(group.end_date) > new Date()
  const studentCount = group.student_groups?.length || 0

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  return (
    <>
      <div className="card p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-sm text-muted-foreground">
              Código: {group.codigo}
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4" />
            {studentCount} / {group.max_students} estudiantes
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="h-4 w-4" />
            {group.coin_limit} Educoins
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {formatDate(group.start_date)} - {formatDate(group.end_date)}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="btn-outline flex items-center gap-2"
          >
            <UserPlusIcon className="h-4 w-4" />
            Agregar estudiante
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-secondary"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Grupo"
      >
        <CreateGroup group={group} onClose={() => setShowEditModal(false)} />
      </Modal>

      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="Agregar Estudiante"
      >
        <AddStudentToGroup
          group={group}
          onClose={() => setShowAddStudentModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Eliminar Grupo"
        size="sm"
      >
        <p>
          ¿Seguro que deseas eliminar el grupo{" "}
          <span className="font-semibold">{group.name}</span>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={() => deleteGroup.mutateAsync(group.id)}
            className="btn-danger"
          >
            {deleteGroup.isPending ? <LoadingSpinner size="sm" /> : "Eliminar"}
          </button>
        </div>
      </Modal>
    </>
  )
}

export default GroupCard
