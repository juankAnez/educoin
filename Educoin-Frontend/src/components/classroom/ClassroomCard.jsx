import { Link } from "react-router-dom"
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  CalendarIcon,
  BookOpenIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline"
import { formatDate } from "../../utils/helpers"

export default function ClassroomCard({ classroom, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {classroom.nombre}
              </h3>
              <p className="text-orange-100 text-sm">
                {classroom.docente_nombre || "Docente"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
          {classroom.descripcion || "Sin descripción disponible"}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <UserGroupIcon className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">Estudiantes</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {classroom.estudiantes_count || 0}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <BookOpenIcon className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">Grupos</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {classroom.grupos_clases?.length || 0}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Creada el {formatDate(classroom.creado)}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          to={`/classrooms/${classroom.id}`}
          className="flex-1 bg-orange-50 text-orange-600 px-4 py-2.5 rounded-lg hover:bg-orange-100 transition text-center text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-orange-500 group-hover:text-white"
        >
          Ver Detalles
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(classroom.id)}
            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}