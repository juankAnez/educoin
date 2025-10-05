"use client"

import { useAuthContext } from "../../context/AuthContext"

export default function ProfilePage() {
  const { user } = useAuthContext()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>

      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <div>
          <p className="text-sm text-gray-500">Nombre</p>
          <p className="text-lg font-medium text-gray-900">
            {user?.first_name} {user?.last_name}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Correo</p>
          <p className="text-lg font-medium text-gray-900">{user?.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Rol</p>
          <p className="text-lg font-medium capitalize text-gray-900">
            {user?.role}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Seguridad</h2>
        <p className="text-gray-600">
          Aquí podrás cambiar tu contraseña más adelante.
        </p>
        <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          Cambiar Contraseña
        </button>
      </div>
    </div>
  )
}
