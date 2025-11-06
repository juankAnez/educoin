import { Link } from "react-router-dom"
import { 
  AcademicCapIcon, 
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  PlusIcon
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, Profesor {user?.first_name}!
        </h1>
        <p className="text-blue-100">
          Panel de gestión de clases, grupos y actividades
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {classrooms?.length || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Clases</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {groups?.length || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Grupos</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {activities?.length || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Actividades</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {totalStudents}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Estudiantes</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/classrooms"
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-orange-500 hover:bg-orange-50 transition"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <PlusIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nueva Clase</h3>
              <p className="text-sm text-gray-500">Crea una nueva clase</p>
            </div>
          </div>
        </Link>

        <Link
          to="/groups"
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PlusIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nuevo Grupo</h3>
              <p className="text-sm text-gray-500">Organiza a tus estudiantes</p>
            </div>
          </div>
        </Link>

        <Link
          to="/activities"
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <PlusIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nueva Actividad</h3>
              <p className="text-sm text-gray-500">Asigna tareas y exámenes</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Classes */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Mis Clases</h2>
          <Link to="/classrooms" className="text-sm text-orange-600 hover:text-orange-700">
            Ver todas →
          </Link>
        </div>
        {classrooms && classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.slice(0, 3).map((classroom) => (
              <Link
                key={classroom.id}
                to={`/classrooms/${classroom.id}`}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded">
                    <AcademicCapIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{classroom.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      {classroom.estudiantes_count || 0} estudiantes
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No tienes clases creadas aún
          </p>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Actividades Recientes</h2>
          <Link to="/activities" className="text-sm text-orange-600 hover:text-orange-700">
            Ver todas →
          </Link>
        </div>
        {activities && activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      {activity.submissions?.length || 0} entregas
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {activity.tipo}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No has creado actividades aún
          </p>
        )}
      </div>
    </div>
  )
}