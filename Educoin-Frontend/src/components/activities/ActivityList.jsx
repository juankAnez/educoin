"use client"

import React from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"
import { useActivities } from "../../hooks/useActivities"
import LoadingSpinner from "../common/LoadingSpinner"

export default function ActivitiesList() {
  const { user } = useAuthContext()
  const { data: activities, isLoading } = useActivities()

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!activities?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No hay actividades disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activities.map((a) => (
        <Link
          key={a.id}
          to={`/activities/${a.id}`}
          className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900">{a.nombre}</h3>
          <p className="text-sm text-gray-600 mt-1">{a.descripcion || "Sin descripción"}</p>
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-500">Grupo: {a.group_nombre || a.group_name || "N/A"}</span>
            <span className="text-orange-600 font-medium">{a.tipo}</span>
          </div>
          {user?.role === "estudiante" && (
            <p className="text-xs text-gray-500 mt-2">
              Fecha límite: {new Date(a.fecha_entrega).toLocaleDateString()}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
