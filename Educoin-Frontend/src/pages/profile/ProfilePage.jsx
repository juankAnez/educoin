"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "../../context/AuthContext"
import EditProfileModal from "../../components/profile/EditProfileModal"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const date = new Date()
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    setCurrentDate(formattedDate)
  }, [])

  if (!user) return <p>Cargando...</p>

  const profile = user.profile || {}

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bienvenido, {user.first_name}</h1>
            <p className="text-blue-100 mt-1">{currentDate}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 sm:mt-0 bg-white text-blue-600 px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-200 to-blue-200 border-b p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-800">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información Personal
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Nombre Completo</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Correo Electrónico</p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">1 mes atrás</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Teléfono</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {profile.telefono || "No registrado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información extra de la cuenta
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Rol</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Institución</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {profile.institucion || "No asignada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Idioma</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      Español
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biography - Full Width */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Biografía
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-900 leading-relaxed">
                {profile.bio || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditProfileModal user={user} onClose={() => setIsEditing(false)} />
      )}
    </div>
  )
}