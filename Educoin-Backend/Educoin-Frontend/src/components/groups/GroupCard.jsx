import { Link } from "react-router-dom"
import { 
  UserGroupIcon, 
  CalendarIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline"
import { formatDate } from "../../utils/helpers"
import toast from "react-hot-toast"

export default function GroupCard({ group, onDelete, isTeacher }) {
  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success("Código copiado al portapapeles")
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {group.nombre}
              </h3>
              <p className="text-blue-100 text-sm">
                {group.classroom?.nombre || "Clase"}
              </p>
            </div>
          </div>
          {/* Badge de estado */}
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            group.activo 
              ? "bg-green-400/20 text-white" 
              : "bg-red-400/20 text-white"
          }`}>
            {group.activo ? (
              <>
                <CheckCircleIcon className="h-3.5 w-3.5" />
                Activo
              </>
            ) : (
              <>
                <XCircleIcon className="h-3.5 w-3.5" />
                Inactivo
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
          {group.descripcion || "Sin descripción disponible"}
        </p>

        {/* Stats */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Estudiantes</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {group.estudiantes?.length || 0}
            </span>
          </div>
        </div>

        {/* Código del grupo (solo docentes) */}
        {isTeacher && group.codigo && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClipboardIcon className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-700 font-medium">Código:</span>
                <span className="font-mono font-bold text-orange-600 text-lg tracking-wider">
                  {group.codigo}
                </span>
              </div>
              <button
                onClick={() => copyCode(group.codigo)}
                className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition text-xs font-medium"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Creado el {formatDate(group.creado)}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          to={`/groups/${group.id}`}
          className="flex-1 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition text-center text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-blue-500 group-hover:text-white"
        >
          Ver Detalles
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        {isTeacher && onDelete && (
          <button
            onClick={() => onDelete(group.id)}
            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}