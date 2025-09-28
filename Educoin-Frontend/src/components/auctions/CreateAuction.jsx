"use client"

import { useState, useEffect } from "react"
import { useCreateAuction, useUpdateAuction } from "../../hooks/useAuctions"
import { validateAuctionForm } from "../../utils/validators"
import LoadingSpinner from "../common/LoadingSpinner"

const CreateAuction = ({ auction, onClose }) => {
  const createAuction = useCreateAuction()
  const updateAuction = useUpdateAuction()
  const isEditing = !!auction

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_price: "",
    end_date: "",
    image: "",
    is_active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (auction) {
      setFormData({
        title: auction.title || "",
        description: auction.description || "",
        starting_price: auction.starting_price || "",
        end_date: auction.end_date ? new Date(auction.end_date).toISOString().slice(0, 16) : "",
        image: auction.image || "",
        is_active: auction.is_active ?? true,
      })
    }
  }, [auction])

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

    const validation = validateAuctionForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      const submitData = {
        ...formData,
        starting_price: Number.parseInt(formData.starting_price),
        end_date: new Date(formData.end_date).toISOString(),
      }

      if (isEditing) {
        await updateAuction.mutateAsync({ id: auction.id, data: submitData })
      } else {
        await createAuction.mutateAsync(submitData)
      }
      onClose()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const isLoading = createAuction.isPending || updateAuction.isPending

  // Get minimum date (current date + 1 hour)
  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 1)
  const minDateString = minDate.toISOString().slice(0, 16)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="label">
            Título del Artículo
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            placeholder="Ej: Auriculares Bluetooth Premium"
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="starting_price" className="label">
            Precio Inicial (Educoins)
          </label>
          <input
            type="number"
            id="starting_price"
            name="starting_price"
            value={formData.starting_price}
            onChange={handleChange}
            className={`input ${errors.starting_price ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            placeholder="100"
            min="1"
            required
          />
          {errors.starting_price && <p className="mt-1 text-sm text-red-600">{errors.starting_price}</p>}
        </div>

        <div>
          <label htmlFor="end_date" className="label">
            Fecha y Hora de Finalización
          </label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className={`input ${errors.end_date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            min={minDateString}
            required
          />
          {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="image" className="label">
            URL de la Imagen (Opcional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="input"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">
          Descripción del Artículo
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`input ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          placeholder="Describe el artículo, sus características y condiciones..."
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
          className="h-4 w-4 text-educoin-600 focus:ring-educoin-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Subasta activa
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? "Actualizar" : "Crear Subasta"}
        </button>
      </div>
    </form>
  )
}

export default CreateAuction
