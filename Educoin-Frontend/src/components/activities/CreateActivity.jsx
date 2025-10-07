"use client"

import React, { useState } from "react"
import { useCreateActivity } from "../../hooks/useActivities"
import { useGroups } from "../../hooks/useGroups"
import LoadingSpinner from "../common/LoadingSpinner"

export default function CreateActivity({ onClose }) {
  const { data: groups, isLoading: loadingGroups } = useGroups()
  const createActivity = useCreateActivity()

  const [formData, setFormData] = useState({
    group: "",
    nombre: "",
    descripcion: "",
    tipo: "tarea",
    valor_educoins: 100,
    valor_notas: 100,
    fecha_entrega: "",
    archivo: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      archivo: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") form.append(key, value)
    })

    try {
      await createActivity.mutateAsync(form)
      onClose()
    } catch (err) {
      console.error("Error al crear actividad:", err)
    }
  }

  if (loadingGroups) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de la actividad</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Ej: Examen parcial 1"
        />
      </div>

      {/* Grupo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Grupo</label>
        <select
          name="group"
          value={formData.group}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Selecciona un grupo</option>
          {groups?.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="tarea">Tarea</option>
          <option value="examen">Examen</option>
          <option value="proyecto">Proyecto</option>
          <option value="quiz">Quiz</option>
          <option value="exposicion">Exposición</option>
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Describe los detalles de la actividad..."
        />
      </div>

      {/* Fecha de entrega */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de entrega</label>
        <input
          type="date"
          name="fecha_entrega"
          value={formData.fecha_entrega}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Valor Educoins */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Valor en Educoins</label>
        <input
          type="number"
          name="valor_educoins"
          value={formData.valor_educoins}
          onChange={handleChange}
          min="0"
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Valor en notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Valor en nota (%)</label>
        <input
          type="number"
          name="valor_notas"
          value={formData.valor_notas}
          onChange={handleChange}
          min="0"
          max="100"
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Archivo opcional */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Archivo (opcional)</label>
        <input
          type="file"
          name="archivo"
          onChange={handleFileChange}
          className="mt-1 w-full text-sm text-gray-700 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={createActivity.isPending}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {createActivity.isPending ? "Creando..." : "Crear Actividad"}
        </button>
      </div>
    </form>
  )
}
