import { useState, useEffect } from "react"
import { useCreateAuction, useUpdateAuction } from "../../hooks/useAuctions"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"
import LoadingSpinner from "../common/LoadingSpinner"

const CreateAuction = ({ auction, onClose }) => {
  const createAuction = useCreateAuction()
  const updateAuction = useUpdateAuction()
  const isEditing = !!auction

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    periodo: "",
    fecha_fin: "",
  })
  const [errors, setErrors] = useState({})

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await api.get("/api/coins/periods/")
      return res.data
    },
  })

  useEffect(() => {
    if (auction) {
      setFormData({
        titulo: auction.titulo || "",
        descripcion: auction.descripcion || "",
        periodo: auction.periodo || "",
        fecha_fin: auction.fecha_fin ? new Date(auction.fecha_fin).toISOString().slice(0, 16) : "",
      })
    }
  }, [auction])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.titulo) newErrors.titulo = "El título es requerido"
    if (!formData.descripcion) newErrors.descripcion = "La descripción es requerida"
    if (!formData.periodo) newErrors.periodo = "Debes seleccionar un periodo"
    if (!formData.fecha_fin) newErrors.fecha_fin = "La fecha de finalización es requerida"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const submitData = {
        ...formData,
        periodo: parseInt(formData.periodo),
        fecha_fin: new Date(formData.fecha_fin).toISOString(),
      }

      if (isEditing) {
        await updateAuction.mutateAsync({ id: auction.id, data: submitData })
      } else {
        await createAuction.mutateAsync(submitData)
      }
      onClose()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const isLoading = createAuction.isPending || updateAuction.isPending

  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 1)
  const minDateString = minDate.toISOString().slice(0, 16)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título de la Subasta
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.titulo ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.descripcion ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
            Periodo
          </label>
          <select
            id="periodo"
            name="periodo"
            value={formData.periodo}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.periodo ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecciona un periodo</option>
            {periods?.map((period) => (
              <option key={period.id} value={period.id}>
                {period.nombre} - {period.grupo_nombre}
              </option>
            ))}
          </select>
          {errors.periodo && <p className="mt-1 text-sm text-red-600">{errors.periodo}</p>}
        </div>

        <div>
          <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Finalización
          </label>
          <input
            type="datetime-local"
            id="fecha_fin"
            name="fecha_fin"
            value={formData.fecha_fin}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.fecha_fin ? "border-red-500" : "border-gray-300"
            }`}
            min={minDateString}
          />
          {errors.fecha_fin && <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? "Actualizar" : "Crear Subasta"}
        </button>
      </div>
    </form>
  )
}

export default CreateAuction