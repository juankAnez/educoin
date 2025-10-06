"use client"

import { useState } from "react"
import { useAuthContext } from "../../context/AuthContext"
import EditProfileModal from "../../components/profile/EditProfileModal"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)

  if (!user) return <p>Cargando...</p>

  const profile = user.profile || {}

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
        >
          Editar Perfil
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <div>
          <p className="text-sm text-gray-500">Nombre</p>
          <p className="text-lg font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Correo</p>
          <p className="text-lg font-medium text-gray-900">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Rol</p>
          <p className="text-lg font-medium capitalize text-gray-900">{user.role}</p>
        </div>

        {/* Campos del modelo Profile */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">Bio</p>
          <p className="text-gray-800">{profile.bio || "Sin descripción"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Teléfono</p>
          <p className="text-gray-800">{profile.telefono || "No registrado"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Institución</p>
          <p className="text-gray-800">{profile.institucion || "No asignada"}</p>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal user={user} onClose={() => setIsEditing(false)} />
      )}
    </div>
  )
}
