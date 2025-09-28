"use client"

import { useState, useEffect } from "react"
import { useCreateGroup, useUpdateGroup } from "../../hooks/useGroups"
import { validateGroupForm } from "../../utils/validators"
import LoadingSpinner from "../common/LoadingSpinner"

const CreateGroup = ({ group, onClose }) => {
  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()
  const isEditing = !!group

  const [formData, setFormData] = useState({
    name: "",
    max_students: 30,
    coin_limit: 1000,
    start_date: "",
    end_date: "",
    is_closed: false,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || "",
        max_students: group.max_students || 30,
        coin_limit: group.coin_limit || 1000,
        start_date: group.start_date || "",
        end_date: group.end_date || "",
        is_closed: group.is_closed || false,
      })
    }
  }, [group])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value) || 0 : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateGroupForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      if (isEditing) {
        await updateGroup.mutateAsync({ id: group.id, data: formData })
      } else {
        await createGroup.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const isLoading = createGroup.isPending || updateGroup.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">
          Nombre del Grupo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          placeholder="Ej: 10-A Matemáticas"
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="max_students" className="label">
            Máximo de Estudiantes
          </label>
          <input
            type="number"
            id="max_students"
            name="max_students"
            value={formData.max_students}
            onChange={handleChange}
            className={`input ${errors.max_students ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            min="1"
            max="50"
            required
          />
          {errors.max_students && <p className="mt-1 text-sm text-red-600">{errors.max_students}</p>}
        </div>

        <div>
          <label htmlFor="coin_limit" className="label">
            Límite de Educoins
          </label>
          <input
            type="number"
            id="coin_limit"
            name="coin_limit"
            value={formData.coin_limit}
            onChange={handleChange}
            className={`input ${errors.coin_limit ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            min="100"
            step="50"
            required
          />
          {errors.coin_limit && <p className="mt-1 text-sm text-red-600">{errors.coin_limit}</p>}
          <p className="mt-1 text-xs text-gray-500">Total de monedas a repartir en el periodo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start_date" className="label">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className={`input ${errors.start_date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            required
          />
          {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
        </div>

        <div>
          <label htmlFor="end_date" className="label">
            Fecha de Fin
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className={`input ${errors.end_date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            required
          />
          {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_closed"
          name="is_closed"
          checked={formData.is_closed}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_closed" className="ml-2 block text-sm text-gray-900">
          Grupo cerrado
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? "Actualizar" : "Crear Grupo"}
        </button>
      </div>
    </form>
  )
}

export default CreateGroup
