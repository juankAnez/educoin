import { Link } from "react-router-dom"
import { 
  AcademicCapIcon, 
  ClipboardDocumentListIcon,
  CurrencyEuroIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"
import { useActivities } from "../../hooks/useActivities"
import { useGroups } from "../../hooks/useGroups"
import { useAuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"
import { useWallet } from "../../hooks/useWallet"

export default function StudentDashboard() {
  const { user } = useAuthContext()
  const { data: activities, isLoading: activitiesLoading } = useActivities()
  const { data: groups, isLoading: groupsLoading } = useGroups()
  const { data: walletData, isLoading: walletLoading } = useWallet()
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
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              ¡Bienvenido, {user?.first_name}!
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Sigue trabajando duro para ganar más Educoins
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-orange-500/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-orange-400/50">
            <p className="text-2xl font-bold text-white">{walletData?.saldo || 0} EC</p>
            <p className="text-blue-100 text-sm">Tus Educoins</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="p-2 bg-red-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendingActivities.length}
              </p>
              <p className="text-xs text-gray-600">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrophyIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {completedActivities.length}
              </p>
              <p className="text-xs text-gray-600">Completadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CurrencyEuroIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {walletData?.saldo || 0}
              </p>
              <p className="text-xs text-gray-600">Educoins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/activities"
          className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <ClipboardDocumentListIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">Ver Actividades</h3>
              <p className="text-sm text-gray-600 mb-2">
                {pendingActivities.length} actividades pendientes
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <span>Ver todas</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/groups"
          className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <AcademicCapIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">Mis Grupos</h3>
              <p className="text-sm text-gray-600 mb-2">
                Gestiona tus grupos y clases
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <span>Gestionar</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Actividades Recientes
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {pendingActivities.length} pendientes
          </span>
        </div>
        
        {pendingActivities.length > 0 ? (
          <div className="space-y-3">
            {pendingActivities.slice(0, 5).map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300">
                    <ClipboardDocumentListIcon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-700">{activity.nombre}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <ClockIcon className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Vence: {new Date(activity.fecha_entrega).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {activity.valor_educoins} EC
                  </span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No hay actividades pendientes</p>
            <p className="text-gray-400 text-xs mt-1">¡Buen trabajo! Has completado todas las actividades.</p>
          </div>
        )}
      </div>
    </div>
  )
}