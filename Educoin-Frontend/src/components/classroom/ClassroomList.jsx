import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  PlusIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  CalendarIcon,
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline"
import { useClassrooms, useCreateClassroom, useDeleteClassroom } from "../../hooks/useClassrooms"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import { formatDate } from "../../utils/helpers"

export default function ClassroomList() {
  const { user } = useAuthContext()
  const { data: classrooms, isLoading } = useClassrooms()
  const createMutation = useCreateClassroom()
  const deleteMutation = useDeleteClassroom()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: ""
  })

  const isTeacher = user?.role === "docente"

  const filteredClassrooms = classrooms?.filter(c => 
    c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync(formData)
      setShowCreateModal(false)
      setFormData({ nombre: "", descripcion: "" })
    } catch (error) {
      console.error("Error creando clase:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta clase?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error("Error eliminando clase:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Clases</h1>
          <p className="text-gray-600 mt-1">
            {isTeacher 
              ? "Gestiona tus clases y estudiantes" 
              : "Clases en las que estás inscrito"}
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva Clase
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar clases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Classrooms Grid */}
      {filteredClassrooms && filteredClassrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                    <h3 className="font-semibold text-white text-lg">
                      {classroom.nombre}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {classroom.descripcion || "Sin descripción"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{classroom.estudiantes_count || 0} estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(classroom.creado)}</span>
                  </div>
                </div>

                {isTeacher && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Docente: {classroom.docente_nombre || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Grupos: {classroom.grupos_clases?.length || 0}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-4 pb-4 flex gap-2">
                <Link
                  to={`/classrooms/${classroom.id}`}
                  className="flex-1 bg-orange-50 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-100 transition text-center text-sm font-medium"
                >
                  Ver Detalles
                </Link>
                {isTeacher && (
                  <button
                    onClick={() => handleDelete(classroom.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay clases disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            {isTeacher
              ? "Comienza creando tu primera clase"
              : "Espera a que tu docente te agregue a una clase"}
          </p>
          {isTeacher && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition"
            >
              Crear Primera Clase
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Clase"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Clase *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: Matemáticas 10°A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe brevemente el contenido de la clase..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {createMutation.isPending ? "Creando..." : "Crear Clase"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}