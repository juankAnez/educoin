"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ArrowLeftIcon,
  UserGroupIcon,
  CalendarIcon,
  BookOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { useClassroom, useClassroomStudents } from "../../hooks/useClassrooms"
import { useAuthContext } from "../../context/AuthContext"
import { formatDate } from "../../utils/helpers"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const ClassroomDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { data: classroom, isLoading: classroomLoading, error: classroomError } = useClassroom(id)
  const { data: students, isLoading: studentsLoading } = useClassroomStudents(id)

  const isTeacher = user?.role === "docente"

  if (classroomLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (classroomError || !classroom) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar la clase: {classroomError?.message}</p>
        <Link to="/classrooms" className="btn-primary mt-4 inline-block">
          Volver a Clases
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/classrooms")}
            className="p-2 hover:bg-gray-50 rounded-lg transition"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{classroom.nombre}</h1>
            <p className="text-gray-600">
              Docente: {classroom.docente_nombre || "N/A"}
            </p>
          </div>
        </div>
        {isTeacher && (
          <button className="btn-secondary flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Configurar
          </button>
        )}
      </div>

      {/* Classroom Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600">
              {classroom.descripcion || "Sin descripción disponible"}
            </p>
          </div>

          {/* Estadísticas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <UserGroupIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">
                  {students?.length || classroom.estudiantes_count || 0} estudiantes
                </span>
              </div>
              <div className="flex items-center text-sm">
                <BookOpenIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">
                  {classroom.grupos_clases?.length || 0} grupos
                </span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">
                  Creada el {formatDate(classroom.creado)}
                </span>
              </div>
            </div>
          </div>

          {/* Grupos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grupos</h3>
            {classroom.grupos_clases && classroom.grupos_clases.length > 0 ? (
              <div className="space-y-2">
                {classroom.grupos_clases.map((grupo) => (
                  <Link
                    key={grupo.id}
                    to={`/groups/${grupo.id}`}
                    className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm"
                  >
                    <p className="font-medium text-gray-900">{grupo.nombre}</p>
                    <p className="text-xs text-gray-500">
                      {grupo.estudiantes?.length || 0} estudiantes
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay grupos creados</p>
            )}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Estudiantes ({students?.length || 0})
          </h2>
          {isTeacher && (
            <button className="btn-secondary text-sm">
              Invitar Estudiantes
            </button>
          )}
        </div>

        {studentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : students && students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-orange-700">
                    {student.first_name?.charAt(0)}
                    {student.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay estudiantes aún
            </h3>
            <p className="text-gray-500 mb-4">
              {isTeacher
                ? "Los estudiantes aparecerán aquí cuando se unan a los grupos de esta clase"
                : "Espera a que tu profesor te agregue"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassroomDetailPage