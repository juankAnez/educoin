"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { UserIcon, EnvelopeIcon, CalendarIcon } from "@heroicons/react/24/outline"
import { formatDate } from "../../utils/helpers"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import toast from "react-hot-toast"

const ProfilePage = () => {
  const { user, updateUser, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      updateUser(formData)
      setIsEditing(false)
      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el perfil")
    }
  }

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-educoin-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-educoin-600">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-gray-500 capitalize">{user?.role}</p>
            <p className="text-sm text-gray-400">Miembro desde {formatDate(user?.date_joined)}</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-outline">
              Editar Perfil
            </button>
          ) : (
            <div className="space-x-2">
              <button onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                Guardar
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="label">
                  Nombre
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="label">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Nombre completo</p>
                <p className="font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de registro</p>
                <p className="font-medium text-gray-900">{formatDate(user?.created_at)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Cuenta</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Estado</p>
            <p className="text-sm text-gray-500">Tu cuenta está activa y verificada</p>
          </div>
          <span className="badge badge-success">Activa</span>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
