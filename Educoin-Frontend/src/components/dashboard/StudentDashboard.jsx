"use client"

import { CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"

export default function StudentDashboard() {
  const { user } = useAuthContext()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Bienvenido, {user?.first_name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Tu Monedero
          </h2>
          <div className="flex items-center gap-3 text-2xl font-bold text-orange-600">
            <CurrencyDollarIcon className="h-7 w-7" />
            {user?.wallet?.balance || 0} monedas
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Progreso en Clases
          </h2>
          <p className="text-gray-600">Aquí irán tus estadísticas.</p>
        </div>
      </div>
    </div>
  )
}
