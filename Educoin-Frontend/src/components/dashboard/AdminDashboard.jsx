"use client"

import { useAuthContext } from "../../context/AuthContext"
import { ArrowRightCircle, Settings, Users, GraduationCap, Trophy } from "lucide-react"

const AdminDashboard = () => {
  const { user } = useAuthContext()

  const openDjangoAdmin = () => {
    window.open("http://localhost:8000/admin/", "_blank")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">
            Bienvenido, {user?.first_name || user?.username || "Admin"}
          </h1>
          <p className="text-muted-foreground">
            Gestiona usuarios, clases, actividades y subastas desde un solo lugar.
          </p>
        </div>

        <button
          onClick={openDjangoAdmin}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Ir al panel Django
          <ArrowRightCircle size={20} />
        </button>
      </div>

      {/* Stats Grid (estos números deberías traerlos de tus endpoints reales) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card p-6 rounded-xl shadow hover:shadow-md transition border border-border flex flex-col items-center">
          <Users className="text-primary mb-3" size={32} />
          <p className="text-3xl font-bold"></p>
          <p className="text-muted-foreground text-sm">Usuarios registrados</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow hover:shadow-md transition border border-border flex flex-col items-center">
          <GraduationCap className="text-primary mb-3" size={32} />
          <p className="text-3xl font-bold"></p>
          <p className="text-muted-foreground text-sm">Clases activas</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow hover:shadow-md transition border border-border flex flex-col items-center">
          <Trophy className="text-primary mb-3" size={32} />
          <p className="text-3xl font-bold"></p>
          <p className="text-muted-foreground text-sm">Subastas en curso</p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="text-primary" size={22} />
          Panel de administración general
        </h2>

        <p className="text-muted-foreground mb-6">
          Desde aquí puedes revisar el estado general del sistema, gestionar roles, eliminar usuarios
          inactivos y sincronizar datos con Django Admin.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="border border-border px-4 py-2 rounded-lg text-foreground hover:bg-muted transition">
            Ver usuarios
          </button>
          <button className="border border-border px-4 py-2 rounded-lg text-foreground hover:bg-muted transition">
            Gestionar clases
          </button>
          <button className="border border-border px-4 py-2 rounded-lg text-foreground hover:bg-muted transition">
            Revisar actividades
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
