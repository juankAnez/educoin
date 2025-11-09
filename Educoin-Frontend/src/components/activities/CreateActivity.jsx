import { useState } from "react"
import { useCreateActivity } from "../../hooks/useActivities"
import { useGroups } from "../../hooks/useGroups"

export default function CreateActivity({ onClose }) {
  const createMutation = useCreateActivity()
  const { data: groups } = useGroups()
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "tarea",
    group: "",
    valor_educoins: 100,
    valor_notas: 100,
    fecha_entrega: "",  // ✅ CORREGIDO: usar fecha_entrega en lugar de fecha_inicio/fecha_fin
    habilitada: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // ✅ CORREGIDO: Convertir a ISO string correctamente
      const fechaEntrega = new Date(formData.fecha_entrega)
      
      await createMutation.mutateAsync({
        ...formData,
        group: parseInt(formData.group),
        valor_educoins: parseInt(formData.valor_educoins),
        valor_notas: parseInt(formData.valor_notas),
        fecha_entrega: fechaEntrega.toISOString(),
      })
      onClose()
    } catch (error) {
      console.error("Error creando actividad:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Actividad *
        </label>
        <input
          type="text"
          required
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Ej: Taller de Álgebra"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo *
          </label>
          <select
            required
            value={formData.tipo}
            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="tarea">Tarea</option>
            <option value="examen">Examen</option>
            <option value="proyecto">Proyecto</option>
            <option value="quiz">Quiz</option>
            <option value="exposicion">Exposición</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grupo *
          </label>
          <select
            required
            value={formData.group}
            onChange={(e) => setFormData({...formData, group: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Selecciona un grupo</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.nombre}
              </option>
            ))}
          </select>
        </div>
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
          placeholder="Describe la actividad..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Educoins *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.valor_educoins}
            onChange={(e) => setFormData({...formData, valor_educoins: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Nota *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.valor_notas}
            onChange={(e) => setFormData({...formData, valor_notas: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Límite *
          </label>
          <input
            type="datetime-local"
            required
            value={formData.fecha_entrega}
            onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="habilitada"
          checked={formData.habilitada}
          onChange={(e) => setFormData({...formData, habilitada: e.target.checked})}
          className="h-4 w-4 text-orange-500 rounded focus:ring-orange-500"
        />
        <label htmlFor="habilitada" className="ml-2 text-sm text-gray-700">
          Actividad habilitada para entregas
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
          disabled={createMutation.isPending}
          className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {createMutation.isPending ? "Creando..." : "Crear Actividad"}
        </button>
      </div>
    </form>
  )
}