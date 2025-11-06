import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  PlusIcon, 
  UserGroupIcon,
  CalendarIcon,
  ClipboardIcon 
} from "@heroicons/react/24/outline"
import { useGroups, useCreateGroup, useDeleteGroup } from "../../hooks/useGroups"
import { useClassrooms } from "../../hooks/useClassrooms"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import Modal from "../common/Modal"
import { formatDate } from "../../utils/helpers"
import toast from "react-hot-toast"

export default function GroupList() {
  const { user } = useAuthContext()
  const { data: groups, isLoading } = useGroups()
  const { data: classrooms } = useClassrooms()
  const createMutation = useCreateGroup()
  const deleteMutation = useDeleteGroup()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    classroom: ""
  })

  const isTeacher = user?.role === "docente"

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        ...formData,
        classroom: parseInt(formData.classroom)
      })
      setShowCreateModal(false)
      setFormData({ nombre: "", descripcion: "", classroom: "" })
    } catch (error) {
      console.error("Error creando grupo:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este grupo?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error("Error eliminando grupo:", error)
      }
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success("Código copiado al portapapeles")
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Grupos</h1>
          <p className="text-gray-600 mt-1">
            {isTeacher 
              ? "Gestiona tus grupos de clase" 
              : "Grupos en los que estás inscrito"}
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo Grupo
          </button>
        )}
      </div>

      {/* Groups Grid */}
      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                  <h3 className="font-semibold text-white text-lg">
                    {group.nombre}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {group.descripcion || "Sin descripción"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{group.estudiantes?.length || 0} estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(group.creado)}</span>
                  </div>
                </div>

                {/* Código del grupo (solo para docentes) */}
                {isTeacher && group.codigo && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <ClipboardIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-mono font-bold text-orange-600">
                          {group.codigo}
                        </span>
                      </div>
                      <button
                        onClick={() => copyCode(group.codigo)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                )}

                <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                  group.activo 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {group.activo ? "Activo" : "Inactivo"}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 pb-4 flex gap-2">
                <Link
                  to={`/groups/${group.id}`}
                  className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-center text-sm font-medium"
                >
                  Ver Detalles
                </Link>
                {isTeacher && (
                  <button
                    onClick={() => handleDelete(group.id)}
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
          <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay grupos disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            {isTeacher
              ? "Comienza creando tu primer grupo"
              : "Espera a que tu docente te agregue a un grupo"}
          </p>
          {isTeacher && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition"
            >
              Crear Primer Grupo
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Grupo"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Grupo *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: Grupo A - Matemáticas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clase *
            </label>
            <select
              required
              value={formData.classroom}
              onChange={(e) => setFormData({...formData, classroom: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecciona una clase</option>
              {classrooms?.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.nombre}
                </option>
              ))}
            </select>
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
              placeholder="Describe el grupo..."
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
              {createMutation.isPending ? "Creando..." : "Crear Grupo"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}