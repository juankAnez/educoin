"use client"

import { useState } from "react"
import {
  MagnifyingGlassIcon,
  PlusIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline"
import ClassroomCard from "./ClassroomCard"
import CreateClassroom from "./CreateClassroom"
import JoinClassroom from "./JoinClassroom"
import { useAuth } from "../../hooks/useAuth"
import { useClassrooms, useDeleteClassroom } from "../../hooks/useClassrooms"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import { debounce } from "../../utils/helpers"

const ClassroomList = () => {
  const { isTeacher } = useAuth()
  const { data: classrooms = [], isLoading, error } = useClassrooms()
  const deleteClassroom = useDeleteClassroom()

  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState(null)
  const [deletingClassroom, setDeletingClassroom] = useState(null)

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term)
  }, 300)

  // Filtrado seguro usando nombre del backend
  const filteredClassrooms = classrooms.filter((classroom) =>
    (classroom?.nombre || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase()),
  )

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom)
    setShowCreateModal(true)
  }

  const handleDelete = (classroom) => {
    setDeletingClassroom(classroom)
  }

  const confirmDelete = async () => {
    if (deletingClassroom) {
      await deleteClassroom.mutateAsync(deletingClassroom.id)
      setDeletingClassroom(null)
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingClassroom(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-background">
        <p className="text-destructive">
          Error al cargar las clases: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-background min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Clases</h1>
          <p className="text-muted-foreground">
            {isTeacher
              ? "Gestiona tus clases y estudiantes"
              : "Clases en las que estás inscrito"}
          </p>
        </div>
        <div className="flex space-x-3">
          {!isTeacher && (
            <button onClick={() => setShowJoinModal(true)} className="btn-outline">
              Unirse a Clase
            </button>
          )}
          {isTeacher && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Clase
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar clases..."
          className="input pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      {/* Classrooms Grid */}
      {filteredClassrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No se encontraron clases" : "No tienes clases aún"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : isTeacher
              ? "Crea tu primera clase para comenzar"
              : "Únete a una clase usando el código proporcionado por tu profesor"}
          </p>
          {!searchTerm && (
            <div className="flex justify-center space-x-3">
              {!isTeacher && (
                <button onClick={() => setShowJoinModal(true)} className="btn-outline">
                  Unirse a Clase
                </button>
              )}
              {isTeacher && (
                <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nueva Clase
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingClassroom ? "Editar Clase" : "Nueva Clase"}
        size="md"
      >
        <CreateClassroom classroom={editingClassroom} onClose={handleCloseModal} />
      </Modal>

      {/* Join Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Unirse a Clase"
        size="sm"
      >
        <JoinClassroom onClose={() => setShowJoinModal(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingClassroom}
        onClose={() => setDeletingClassroom(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            ¿Estás seguro de que deseas eliminar la clase "
            {deletingClassroom?.nombre}"? Esta acción no se puede deshacer.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setDeletingClassroom(null)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteClassroom.isPending}
              className="btn bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClassroom.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ClassroomList
