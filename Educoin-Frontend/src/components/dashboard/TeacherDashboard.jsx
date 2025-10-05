"use client"

import { BookOpenIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"

export default function TeacherDashboard() {
  const { user } = useAuthContext()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Bienvenido Profesor, {user?.first_name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-2">
            <BookOpenIcon className="h-6 w-6 text-orange-500" />
            Mis Clases
          </h2>
          <p className="text-gray-600">
            Administra y crea clases para tus estudiantes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-2">
            <UserGroupIcon className="h-6 w-6 text-orange-500" />
            Estudiantes
          </h2>
          <p className="text-gray-600">
            Visualiza y gestiona tus grupos y estudiantes inscritos.
          </p>
        </div>
      </div>
    </div>
  )
}
