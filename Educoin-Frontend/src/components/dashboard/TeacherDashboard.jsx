import { Link } from "react-router-dom"
import { 
  AcademicCapIcon, 
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  PlusIcon,
  UsersIcon
} from "@heroicons/react/24/outline"
import { useClassrooms } from "../../hooks/useClassrooms"
import { useGroups } from "../../hooks/useGroups"
import { useActivities } from "../../hooks/useActivities"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"

export default function TeacherDashboard() {
  const { user } = useAuthContext()
  const { data: classrooms, isLoading: classroomsLoading } = useClassrooms()
  const { data: groups, isLoading: groupsLoading } = useGroups()
  const { data: activities, isLoading: activitiesLoading } = useActivities()

  if (classroomsLoading || groupsLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalStudents = classrooms?.reduce((acc, c) => acc + (c.estudiantes_count || 0), 0) || 0

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              ¡Bienvenido, Profesor {user?.first_name}!
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Panel de gestión de clases, grupos y actividades
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-500/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-400/50">
            <p className="text-lg font-bold text-white">{classrooms?.length || 0} Clases</p>
            <p className="text-blue-100 text-sm">Activas</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {classrooms?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Clases</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {groups?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Grupos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activities?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Actividades</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalStudents}
              </p>
              <p className="text-xs text-gray-600">Estudiantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/classrooms"
          className="group bg-white rounded-xl p-5 shadow-sm border-2 border-dashed border-gray-200 hover:border-orange-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <PlusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Nueva Clase</h3>
              <p className="text-sm text-gray-600 mt-1">Crea una nueva clase</p>
            </div>
          </div>
        </Link>

        <Link
          to="/groups"
          className="group bg-white rounded-xl p-5 shadow-sm border-2 border-dashed border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <PlusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Nuevo Grupo</h3>
              <p className="text-sm text-gray-600 mt-1">Organiza a tus estudiantes</p>
            </div>
          </div>
        </Link>

        <Link
          to="/activities"
          className="group bg-white rounded-xl p-5 shadow-sm border-2 border-dashed border-gray-200 hover:border-purple-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <PlusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Nueva Actividad</h3>
              <p className="text-sm text-gray-600 mt-1">Asigna tareas y exámenes</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mis Clases</h2>
            <Link to="/classrooms" className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1">
              <span>Ver todas</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {classrooms && classrooms.length > 0 ? (
            <div className="space-y-3">
              {classrooms.slice(0, 3).map((classroom) => (
                <Link
                  key={classroom.id}
                  to={`/classrooms/${classroom.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-orange-300">
                      <AcademicCapIcon className="h-4 w-4 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-orange-700">{classroom.nombre}</h4>
                      <p className="text-sm text-gray-500">
                        {classroom.estudiantes_count || 0} estudiantes
                      </p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No tienes clases creadas aún</p>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Actividades Recientes</h2>
            <Link to="/activities" className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1">
              <span>Ver todas</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <Link
                  key={activity.id}
                  to={`/activities/${activity.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 border border-gray-100 hover:border-purple-200 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-purple-300">
                      <ClipboardDocumentListIcon className="h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-purple-700">{activity.nombre}</h4>
                      <p className="text-sm text-gray-500">
                        {activity.submissions?.length || 0} entregas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {activity.tipo}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No has creado actividades aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}