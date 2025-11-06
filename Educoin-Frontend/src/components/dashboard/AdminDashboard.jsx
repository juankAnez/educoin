import { useAuthContext } from "../../context/AuthContext"

export default function AdminDashboard() {
  const { user } = useAuthContext()

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-300">
          Bienvenido, {user?.first_name}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Funciones de Administrador
        </h2>
        <p className="text-gray-600">
          Panel de administración en construcción...
        </p>
      </div>
    </div>
  )
}