"use client"

import { useState, useEffect } from "react"
import { useCreateClassroom, useUpdateClassroom } from "../../hooks/useClassrooms"
import { validateClassroomForm } from "../../utils/validators"
import LoadingSpinner from "../common/LoadingSpinner"

const CreateClassroom = ({ classroom, onClose }) => {
  const createClassroom = useCreateClassroom()
  const updateClassroom = useUpdateClassroom()
  const isEditing = !!classroom

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    is_active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (classroom) {
      setFormData({
        nombre: classroom?.nombre || "",
        descripcion: classroom?.descripcion || "",
        is_active: classroom?.is_active ?? true,
      })
    }
  }, [classroom])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateClassroomForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      if (isEditing) {
        await updateClassroom.mutateAsync({ id: classroom.id, data: formData })
      } else {
        await createClassroom.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      // handled by mutation
    }
  }

  const isLoading = createClassroom.isPending || updateClassroom.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="label">
          Nombre de la Clase
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`input ${errors.nombre ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          placeholder="Ej: Matemáticas 10A"
          required
        />
        {errors.nombre && <p className="mt-1 text-sm text-destructive">{errors.nombre}</p>}
      </div>

      <div>
        <label htmlFor="descripcion" className="label">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
          className={`input ${errors.descripcion ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          placeholder="Describe el contenido y objetivos de la clase..."
        />
        {errors.descripcion && <p className="mt-1 text-sm text-destructive">{errors.descripcion}</p>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-educoin-600 focus:ring-educoin-500 border-border rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-foreground">
          Clase activa
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? "Actualizar" : "Crear Clase"}
        </button>
      </div>
    </form>
  )
}

export default CreateClassroom
