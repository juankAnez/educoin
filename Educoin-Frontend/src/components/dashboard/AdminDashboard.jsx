import { useState } from "react"
import { 
  UsersIcon, 
  AcademicCapIcon,
  MagnifyingGlassIcon,
  PencilIcon
} from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import { useAllUsers } from "../../hooks/useUsers"

export default function AdminDashboard() {
  const { user } = useAuthContext()
  const { data: users, isLoading } = useAllUsers()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const mockUsers = users || []

  const filteredUsers = mockUsers?.filter(u => {
    const matchesSearch = 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === "all" || u.role === filterRole

    return matchesSearch && matchesRole
  })

  const roleColors = {
    admin: "bg-red-100 text-red-700 border border-red-200",
    docente: "bg-blue-100 text-blue-700 border border-blue-200",
    estudiante: "bg-green-100 text-green-700 border border-green-200"
  }

  const roleLabels = {
    admin: "Administrador",
    docente: "Docente",
    estudiante: "Estudiante"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-gray-300">Bienvenido, {user?.first_name}</p>
          </div>
          <a          
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 bg-white text-gray-800 px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
          >
            <span>Admin Django</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UsersIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUsers?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Total Usuarios</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUsers?.filter(u => u.role === "estudiante").length || 0}
              </p>
              <p className="text-xs text-gray-600">Estudiantes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUsers?.filter(u => u.role === "docente").length || 0}
              </p>
              <p className="text-xs text-gray-600">Docentes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UsersIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUsers?.filter(u => u.role === "admin").length || 0}
              </p>
              <p className="text-xs text-gray-600">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 lg:mb-0">Gestión de Usuarios</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">Todos los roles</option>
              <option value="estudiante">Estudiantes</option>
              <option value="docente">Docentes</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
        </div>

        {/* Info Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Para gestión completa de usuarios, utiliza el Admin de Django.
          </p>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers?.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                  {u.first_name?.charAt(0)}{u.last_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {u.first_name} {u.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                    <span className="text-xs text-gray-500">ID: {u.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={`http://localhost:8000/admin/users/user/${u.id}/change/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  title="Editar en Django Admin"
                >
                  <PencilIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers?.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  )
}