"use client"

import { useAuthContext } from "../../context/AuthContext"
import { ArrowRightCircle, Settings, Users, GraduationCap, Trophy } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuthContext()

  const openDjangoAdmin = () => {
    window.open("http://localhost:8000/admin/", "_blank")
  }

  const openDjangoAdminUsers = () => { 
    open("http://localhost:8000/admin/users/user/", "_blank")
  }

    const openDjangoAdminClases = () => {
    open("http://localhost:8000/admin/classrooms/classroom/", "_blank")
  }

    const openDjangoAdminActividades = () => {
    open("http://localhost:8000/admin/activities/activity/", "_blank")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {user?.first_name || user?.username || "Administrador"}
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios, clases, actividades y subastas desde un solo panel.
          </p>
        </div>

        <button
          onClick={openDjangoAdmin}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Ir al panel Django
          <ArrowRightCircle size={18} />
        </button>
      </div>

      {/* Estadísticas globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow transition">
          <Users className="text-orange-500 mb-3" size={32} />
          <p className="text-3xl font-bold text-gray-900">–</p>
          <p className="text-sm text-gray-500 mt-1">Usuarios registrados</p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow transition">
          <GraduationCap className="text-orange-500 mb-3" size={32} />
          <p className="text-3xl font-bold text-gray-900">–</p>
          <p className="text-sm text-gray-500 mt-1">Clases activas</p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow transition">
          <Trophy className="text-orange-500 mb-3" size={32} />
          <p className="text-3xl font-bold text-gray-900">–</p>
          <p className="text-sm text-gray-500 mt-1">Subastas en curso</p>
        </div>
      </div>

      {/* Panel de gestión */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-900">
          <Settings className="text-orange-500" size={22} />
          Panel de administración general
        </h2>

        <p className="text-gray-600 mb-6">
          Desde aquí puedes revisar el estado general del sistema, gestionar roles,
          eliminar usuarios inactivos o sincronizar datos directamente con Django Admin.
        </p>

        <div className="flex flex-wrap gap-4">
          <button onClick={openDjangoAdminUsers} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-orange-50 transition">
            Ver usuarios
          </button>
          <button onClick={openDjangoAdminClases} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-orange-50 transition">
            Gestionar clases
          </button>
          <button onClick={openDjangoAdminActividades} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-orange-50 transition">
            Revisar actividades
          </button>
        </div>
      </div>
    </div>
  )
}
