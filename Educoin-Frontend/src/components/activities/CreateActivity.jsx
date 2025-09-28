"use client"

import { useState, useEffect } from "react"
import { useCreateActivity, useUpdateActivity } from "../../hooks/useActivities"
import { useGroups } from "../../hooks/useGroups"
import { validateActivityForm } from "../../utils/validators"
import LoadingSpinner from "../common/LoadingSpinner"

const CreateActivity = ({ activity, onClose }) => {
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()
  const { data: groups } = useGroups()
  const isEditing = !!activity

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_coins: "",
    group: "",
    due_date: "",
    difficulty: "medium",
    is_active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || "",
        description: activity.description || "",
        reward_coins: activity.reward_coins || "",
        group: activity.group || "",
        due_date: activity.due_date ? activity.due_date.split("T")[0] : "",
        difficulty: activity.difficulty || "medium",
        is_active: activity.is_active ?? true,
      })
    }
  }, [activity])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateActivityForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      const submitData = {
        ...formData,
        reward_coins: Number.parseInt(formData.reward_coins),
        due_date: formData.due_date || null,
      }

      if (isEditing) {
        await updateActivity.mutateAsync({ id: activity.id, data: submitData })
      } else {
        await createActivity.mutateAsync(submitData)
      }
      onClose()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const isLoading = createActivity.isPending || updateActivity.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="label">
            Título de la Actividad
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            placeholder="Ej: Tarea de Matemáticas - Capítulo 5"
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="group" className="label">
            Grupo
          </label>
          <select
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            className={`input ${errors.group ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            required
          >
            <option value="">Selecciona un grupo</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.group && <p className="mt-1 text-sm text-red-600">{errors.group}</p>}
        </div>

        <div>
          <label htmlFor="reward_coins" className="label">
            Recompensa (Educoins)
          </label>
          <input
            type="number"
            id="reward_coins"
            name="reward_coins"
            value={formData.reward_coins}
            onChange={handleChange}
            className={`input ${errors.reward_coins ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            placeholder="50"
            min="1"
            required
          />
          {errors.reward_coins && <p className="mt-1 text-sm text-red-600">{errors.reward_coins}</p>}
        </div>

        <div>
          <label htmlFor="difficulty" className="label">
            Dificultad
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="input"
          >
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <div>
          <label htmlFor="due_date" className="label">
            Fecha de Vencimiento (Opcional)
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`input ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          placeholder="Describe la actividad, objetivos y criterios de evaluación..."
          required
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Actividad activa
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? "Actualizar" : "Crear Actividad"}
        </button>
      </div>
    </form>
  )
}

export default CreateActivity
