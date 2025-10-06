"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpenIcon,
  UserGroupIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline"
import { useClassrooms } from "../../hooks/useClassrooms"
import { useGroups } from "../../hooks/useGroups"
import { useAuthContext } from "../../context/AuthContext"
import CreateClassroom from "../classroom/CreateClassroom"
import CreateGroup from "../groups/CreateGroup"
import LoadingSpinner from "../common/LoadingSpinner"

export default function TeacherDashboard() {
  const { user } = useAuthContext()
  const { data: classrooms, isLoading: loadingClassrooms } = useClassrooms()
  const { data: groups, isLoading: loadingGroups } = useGroups()

  const [showClassroomModal, setShowClassroomModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)

  if (loadingClassrooms || loadingGroups) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, Profesor {user?.first_name}
          </h1>
          <p className="text-gray-600">
            Administra tus clases y grupos con un par de clics.
          </p>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-xl shadow-sm p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-500">Clases creadas</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {classrooms?.length || 0}
            </p>
          </div>
          <BookOpenIcon className="h-10 w-10 text-orange-500" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-xl shadow-sm p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-500">Grupos activos</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {groups?.length || 0}
            </p>
          </div>
          <UserGroupIcon className="h-10 w-10 text-orange-500" />
        </motion.div>
      </div>

      {/* Crear nuevo */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-6 w-6 text-orange-500" />
          Crear nuevo
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowClassroomModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            <BookOpenIcon className="h-5 w-5 inline-block mr-2" />
            Nueva Clase
          </button>

          <button
            onClick={() => setShowGroupModal(true)}
            className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition"
          >
            <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
            Nuevo Grupo
          </button>
        </div>
      </div>

      {/* Listado de clases */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tus Clases</h2>
        {classrooms?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((cls) => (
              <motion.div
                key={cls.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white border rounded-xl shadow-sm p-5"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {cls.nombre}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{cls.descripcion}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Grupos: {cls.grupos_clases?.length || 0}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aún no has creado clases.</p>
        )}
      </div>

      {/* Modales */}
      {showClassroomModal && (
        <CreateClassroom onClose={() => setShowClassroomModal(false)} />
      )}
      {showGroupModal && <CreateGroup onClose={() => setShowGroupModal(false)} />}
    </div>
  )
}
