import { Link } from "react-router-dom"
import { AcademicCapIcon, UserGroupIcon } from "@heroicons/react/24/outline"

export default function ClassroomCard({ classroom }) {
  return (
    <Link
      to={`/classrooms/${classroom.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <AcademicCapIcon className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{classroom.nombre}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {classroom.descripcion || "Sin descripción"}
          </p>
          <div className="flex items-center mt-3 text-xs text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{classroom.estudiantes_count || 0} estudiantes</span>
          </div>
        </div>
      </div>
    </Link>
  )
}