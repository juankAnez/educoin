"use client"

import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { authService } from "../../services/auth"

export default function EditProfileModal({ user, onClose }) {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    bio: user.profile?.bio || "",
    telefono: user.profile?.telefono || "",
    institucion: user.profile?.institucion || "",
  })

  const mutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente")
      onClose()
      window.location.reload() // 🔁 Actualiza el perfil actual
    },
    onError: (err) => {
      toast.error(err.message || "Error al actualizar perfil")
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Editar Perfil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Nombre</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Apellido</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input w-full h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Institución</label>
              <input
                name="institucion"
                value={formData.institucion}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
            >
              {mutation.isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
