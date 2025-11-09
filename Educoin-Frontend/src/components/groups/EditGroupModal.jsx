import { useState, useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useUpdateGroup } from "../../hooks/useGroups"
import { useClassrooms } from "../../hooks/useClassrooms"
import LoadingSpinner from "../common/LoadingSpinner"

export default function EditGroupModal({ group, onClose }) {
  const updateMutation = useUpdateGroup()
  const { data: classrooms } = useClassrooms()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    classroom: "",
    activo: true
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (group) {
      setFormData({
        nombre: group.nombre || "",
        descripcion: group.descripcion || "",
        classroom: group.classroom?.id || group.classroom || "",
        activo: group.activo !== undefined ? group.activo : true
      })
    }
  }, [group])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }
    if (!formData.classroom) {
      newErrors.classroom = "La clase es requerida"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: group.id,
        data: {
          ...formData,
          classroom: parseInt(formData.classroom)
        }
      })
      onClose()
    } catch (error) {
      console.error("Error actualizando grupo:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-opacity-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl w-full max-w-lg shadow-lg border border-blue-400 shadow-blue-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Editar Grupo
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Grupo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Grupo A - Matemáticas"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clase
              </label>
              <select
                name="classroom"
                value={formData.classroom}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.classroom ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecciona una clase</option>
                {classrooms?.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.nombre}
                  </option>
                ))}
              </select>
              {errors.classroom && (
                <p className="mt-1 text-sm text-red-600">{errors.classroom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe el grupo..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                Grupo activo
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
              >
                {updateMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}