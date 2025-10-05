"use client"

import { useState } from "react"
import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline"
import { useGroups, useDeleteGroup } from "../../hooks/useGroups"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import CreateGroup from "./CreateGroup"
import GroupCard from "./GroupCard"

const GroupList = ({ classroomId }) => {
  const { isTeacher } = useAuthContext()
  const { data: groups = [], isLoading, error } = useGroups(classroomId)
  const deleteGroup = useDeleteGroup()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [deletingGroup, setDeletingGroup] = useState(null)

  const handleEdit = (group) => {
    setEditingGroup(group)
    setShowCreateModal(true)
  }

  const handleDelete = (group) => {
    setDeletingGroup(group)
  }

  const confirmDelete = async () => {
    if (deletingGroup) {
      await deleteGroup.mutateAsync(deletingGroup.id)
      setDeletingGroup(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error al cargar los grupos: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-educoin-600" />
          Grupos
        </h2>
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Grupo
          </button>
        )}
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No hay grupos creados aún.
        </div>
      )}

      {/* Modal Crear/Editar Grupo */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setEditingGroup(null)
        }}
        title={editingGroup ? "Editar Grupo" : "Nuevo Grupo"}
        size="md"
      >
        <CreateGroup
          group={editingGroup}
          classroomId={classroomId}
          onClose={() => {
            setShowCreateModal(false)
            setEditingGroup(null)
          }}
        />
      </Modal>

      {/* Confirmación eliminar */}
      <Modal
        isOpen={!!deletingGroup}
        onClose={() => setDeletingGroup(null)}
        title="Eliminar Grupo"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            ¿Estás seguro de que deseas eliminar el grupo{" "}
            <span className="font-semibold">{deletingGroup?.name}</span>? Esta
            acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeletingGroup(null)} className="btn-secondary">
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteGroup.isPending}
              className="btn-danger"
            >
              {deleteGroup.isPending ? <LoadingSpinner size="sm" /> : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default GroupList
