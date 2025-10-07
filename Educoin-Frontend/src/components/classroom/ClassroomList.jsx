"use client"

import { useState } from "react"
import {
  MagnifyingGlassIcon,
  PlusIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline"
import ClassroomCard from "./ClassroomCard"
import CreateClassroom from "./CreateClassroom"
import { useAuthContext } from "../../context/AuthContext"
import { useClassrooms, useDeleteClassroom } from "../../hooks/useClassrooms"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import { debounce } from "../../utils/helpers"

const ClassroomList = () => {
  const { isTeacher } = useAuthContext()
  const { data: classrooms = [], isLoading, error } = useClassrooms()
  const deleteClassroom = useDeleteClassroom()

  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState(null)
  const [deletingClassroom, setDeletingClassroom] = useState(null)

  const debouncedSearch = debounce((term) => setSearchTerm(term), 300)

  const filteredClassrooms = classrooms.filter((classroom) =>
    (classroom?.nombre || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
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
        <p className="text-red-500 font-medium">
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
          <h1 className="text-2xl font-bold text-gray-900">Mis Clases</h1>
          <p className="text-gray-500">
            {isTeacher
              ? "Gestiona tus clases, grupos y estudiantes"
              : "Clases en las que estás inscrito"}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Clase
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar clases..."
          className="input pl-10 bg-white border border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
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
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {searchTerm ? "No se encontraron clases" : "No tienes clases aún"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : isTeacher
              ? "Crea tu primera clase para comenzar"
              : "Únete a una clase desde el panel de grupos"}
          </p>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingClassroom ? "Editar Clase" : "Nueva Clase"}
        size="md"
      >
        <CreateClassroom
          classroom={editingClassroom}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal
        isOpen={!!deletingClassroom}
        onClose={() => setDeletingClassroom(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Seguro que deseas eliminar la clase "
            <span className="font-semibold">{deletingClassroom?.nombre}</span>"?
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
              className="btn-danger"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ClassroomList
