"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CurrencyDollarIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"
import { useGroups } from "../../hooks/useGroups"
import { useClassrooms } from "../../hooks/useClassrooms"
import JoinGroupCard from "../groups/JoinGroupCard"
import LoadingSpinner from "../common/LoadingSpinner"

export default function StudentDashboard() {
  const { user } = useAuthContext()
  const { data: groups, isLoading: loadingGroups } = useGroups()
  const { data: classrooms, isLoading: loadingClassrooms } = useClassrooms()
  const [showJoinCard, setShowJoinCard] = useState(false)

  if (loadingGroups || loadingClassrooms) {
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
            Bienvenido, {user?.first_name || "Estudiante"}
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver tu progreso, tus grupos y tu monedero de Educoins
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-xl shadow-sm p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-500">Educoins disponibles</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {user?.wallet?.balance || 0}
            </p>
          </div>
          <CurrencyDollarIcon className="h-10 w-10 text-orange-500" />
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

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-xl shadow-sm p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-500">Clases inscritas</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {classrooms?.length || 0}
            </p>
          </div>
          <AcademicCapIcon className="h-10 w-10 text-orange-500" />
        </motion.div>
      </div>

      {/* Botón Unirse a Grupo */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowJoinCard(!showJoinCard)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
        >
          {showJoinCard ? "Cerrar" : "Unirse a un grupo"}
        </button>
      </div>

      {/* Card de unirse */}
      {showJoinCard && <JoinGroupCard />}

      {/* Listado de grupos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tus Grupos</h2>
        {groups?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((g) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={g.id}
                className="bg-white border rounded-xl shadow-sm p-5"
              >
                <h3 className="text-lg font-semibold text-gray-900">{g.nombre}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Clase: {g.classroom_nombre || "No asignada"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Código: <span className="font-mono">{g.codigo}</span>
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Aún no te has unido a ningún grupo. ¡Pide a tu docente el código!
          </p>
        )}
      </div>
    </div>
  )
}
