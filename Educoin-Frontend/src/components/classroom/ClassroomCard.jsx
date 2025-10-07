"use client"

import { Users, BookOpen, ArrowRight, User } from "lucide-react"
import { Link } from "react-router-dom"

export default function ClassroomCard({ classroom }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-orange-500 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900">
            {classroom.nombre}
          </h2>
        </div>

        {classroom.docente && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Docente:</span> {classroom.docente.first_name} {classroom.docente.last_name}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1 text-orange-500" />
          {classroom.estudiantes_count || 0} estudiantes
        </div>

        <Link
          to={`/classrooms/${classroom.id}`}
          className="flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          Ver detalles
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
