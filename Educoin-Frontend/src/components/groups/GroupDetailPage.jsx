"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ArrowLeftIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
} from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"
import { formatDate } from "../../utils/helpers"
import LoadingSpinner from "../common/LoadingSpinner"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"
import { useState } from "react"
import EditGroupModal from "./EditGroupModal"

export default function GroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  
  // Fetch group data
  const { data: group, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const res = await api.get(`/api/groups/${id}/`)
      return res.data
    },
    enabled: !!id,
  })

  const [showEditModal, setShowEditModal] = useState(false)
  const isTeacher = user?.role === "docente"

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success("Código copiado al portapapeles")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Grupo no encontrado</p>
        <Link to="/groups" className="btn-primary mt-4 inline-block">
          Volver a Grupos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/groups")}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ArrowLeftIcon className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{group.nombre}</h1>
                <p className="text-blue-100">
                  Clase: {group.classroom?.nombre || "N/A"}
                </p>
              </div>
            </div>
          </div>
          {isTeacher && (
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
            >
              <PencilIcon className="h-5 w-5" />
              Editar Grupo
            </button>
          )}
        </div>
      </div>

      {/* Group Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600">
              {group.descripcion || "Sin descripción disponible"}
            </p>
          </div>

          {/* Estadísticas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <UserGroupIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">
                  {group.estudiantes?.length || 0} estudiantes
                </span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">
                  Creado el {formatDate(group.creado)}
                </span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  group.activo 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {group.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Código (solo docentes) */}
          {isTeacher && group.codigo && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Código de Acceso</h3>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ClipboardIcon className="h-5 w-5 text-orange-600" />
                    <span className="font-mono font-bold text-orange-600 text-2xl tracking-wider">
                      {group.codigo}
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(group.codigo)}
                    className="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition text-sm font-medium"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  Comparte este código con tus estudiantes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Estudiantes ({group.estudiantes?.length || 0})
          </h2>
          {isTeacher && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-2">
              <UserPlusIcon className="h-4 w-4" />
              Agregar Estudiantes
            </button>
          )}
        </div>

        {group.estudiantes && group.estudiantes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.estudiantes.map((student) => (
              <div
                key={student.id}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-700">
                    {student.first_name?.charAt(0)}
                    {student.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay estudiantes aún
            </h3>
            <p className="text-gray-500 mb-4">
              {isTeacher
                ? "Los estudiantes pueden unirse usando el código de acceso"
                : "Espera a que otros estudiantes se unan"}
            </p>
            {isTeacher && group.codigo && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-gray-700 mb-2">Comparte este código:</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono font-bold text-orange-600 text-xl">
                    {group.codigo}
                  </span>
                  <button
                    onClick={() => copyCode(group.codigo)}
                    className="px-2 py-1 bg-orange-600 text-white rounded text-xs"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activities Preview (solo docentes) */}
      {isTeacher && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Actividades del Grupo
            </h2>
            <Link
              to="/activities"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              Ver todas
              <ArrowLeftIcon className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Las actividades asignadas a este grupo aparecerán aquí
            </p>
            <Link
              to="/activities"
              className="text-sm text-orange-600 hover:text-orange-700 mt-2 inline-block"
            >
              Crear actividad
            </Link>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && (
        <EditGroupModal
          group={group}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}