import { useState } from "react"
import { useCreateSubmission } from "../../hooks/useActivities"
import Modal from "../common/Modal"

export default function SubmitActivityForm({ activityId, onClose }) {
  const createMutation = useCreateSubmission()
  const [formData, setFormData] = useState({
    contenido: "",
    archivo: null
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({...formData, archivo: file})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = new FormData()
    data.append("activity", activityId)
    data.append("contenido", formData.contenido)
    if (formData.archivo) {
      data.append("archivo", formData.archivo)
    }

    try {
      await createMutation.mutateAsync(data)
      onClose()
    } catch (error) {
      console.error("Error enviando actividad:", error)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Entregar Actividad">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comentario / Respuesta
          </label>
          <textarea
            value={formData.contenido}
            onChange={(e) => setFormData({...formData, contenido: e.target.value})}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Escribe tu respuesta o comentarios aquí..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivo Adjunto (Opcional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {formData.archivo && (
            <p className="text-sm text-gray-600 mt-1">
              Archivo seleccionado: {formData.archivo.name}
            </p>
          )}
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
            {createMutation.isPending ? "Enviando..." : "Enviar Entrega"}
          </button>
        </div>
      </form>
    </Modal>
  )
}