import { Link } from "react-router-dom"
import { 
  AcademicCapIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  TrophyIcon
} from "@heroicons/react/24/outline"
import { useActivities } from "../../hooks/useActivities"
import { useGroups } from "../../hooks/useGroups"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"

export default function StudentDashboard() {
  const { user } = useAuthContext()
  const { data: activities, isLoading: activitiesLoading } = useActivities()
  const { data: groups, isLoading: groupsLoading } = useGroups()

  const pendingActivities = activities?.filter(a => !a.submissions?.length) || []
  const completedActivities = activities?.filter(a => a.submissions?.length > 0) || []

  if (activitiesLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.first_name}!
        </h1>
        <p className="text-orange-100">
          Sigue trabajando duro para ganar más Educoins
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {groups?.length || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Grupos</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {pendingActivities.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pendientes</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {completedActivities.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Completadas</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">
              0 EC
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Educoins</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/activities"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ver Actividades</h3>
              <p className="text-sm text-gray-500">
                {pendingActivities.length} actividades pendientes
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/groups"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mis Grupos</h3>
              <p className="text-sm text-gray-500">
                Gestiona tus grupos y clases
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividades Recientes
        </h2>
        {pendingActivities.length > 0 ? (
          <div className="space-y-3">
            {pendingActivities.slice(0, 5).map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      Vence: {new Date(activity.fecha_entrega).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-orange-600">
                  {activity.valor_educoins} EC
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No hay actividades pendientes
          </p>
        )}
      </div>
    </div>
  )
}