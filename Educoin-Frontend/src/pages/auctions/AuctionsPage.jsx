import React, { useState } from "react";
import AuctionList from "../../components/auctions/AuctionList";
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  ArrowRightOnRectangleIcon,
  CurrencyEuroIcon,
  GifIcon,
  TrophyIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import { useAuthContext } from "../../context/AuthContext";
import { useWallet } from "../../hooks/useWallet";
import { USER_ROLES } from "../../utils/constants";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === "function") {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-lg p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ocurrió un error
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudieron cargar las subastas. Intenta recargar la lista o revisa la consola para más detalles.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Reintentar
            </button>
            
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AuctionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuthContext();
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const isStudent = user?.role === USER_ROLES.STUDENT;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                  <GifIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Subastas Académicas
                </h1>
              </div>
              <p className="text-gray-600 max-w-2xl text-lg">
                Convierte tus Educoins en recompensas exclusivas. Puja por beneficios académicos y demuestra tu esfuerzo.
              </p>
            </div>
            
            {isStudent && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <CurrencyEuroIcon className="h-8 w-8 text-orange-100" />
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Tu saldo disponible</p>
                    <p className="text-2xl font-bold">
                      {walletLoading ? "Cargando..." : `${walletData?.saldo || 0} EC`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">+5</p>
                <p className="text-sm text-gray-600">Subastas activas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Estudiantes participando</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CurrencyEuroIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">350</p>
                <p className="text-sm text-gray-600">Educoins en juego</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Subastas Disponibles</h2>
            <p className="text-gray-600 mt-1">Puja por recompensas académicas exclusivas</p>
          </div>
          
          <div className="p-6">
            <ErrorBoundary onReset={() => setRefreshKey((k) => k + 1)}>
              <AuctionList key={refreshKey} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-900 text-lg mb-3 flex items-center gap-2">
                <TrophyIcon className="h-5 w-5" />
                ¿Cómo funcionan las subastas?
              </h3>
              <div className="space-y-3 text-blue-700">
                <p className="flex items-start gap-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                  <span>Los profesores crean subastas con recompensas académicas</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                  <span>Los estudiantes pujan usando sus Educoins ganados en actividades</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                  <span>Al terminar el tiempo, el mejor postor gana la recompensa</span>
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="font-semibold text-orange-900 text-lg mb-3">Tipos de recompensas</h3>
              <div className="space-y-2 text-orange-700">
                <p>✅ Puntos extra en exámenes</p>
                <p>✅ Exoneración de actividades</p>
                <p>✅ Beneficios especiales en clase</p>
                <p>✅ Material exclusivo</p>
                <p>✅ Reconocimientos académicos</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-green-900 text-lg mb-3">Consejos para pujar</h3>
              <div className="space-y-3 text-green-700">
                <div className="flex items-start gap-3">
                  <div className="bg-green-200 text-green-800 rounded-lg p-2">
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                  <p>Administra tus Educoins sabiamente - no gastes todo en una subasta</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-200 text-green-800 rounded-lg p-2">
                    <AcademicCapIcon className="h-4 w-4" />
                  </div>
                  <p>Prioriza recompensas que realmente te beneficien académicamente</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-200 text-green-800 rounded-lg p-2">
                    <GifIcon className="h-4 w-4" />
                  </div>
                  <p>Mantente atento al tiempo restante de cada subasta</p>
                </div>
              </div>
            </div>

            {isStudent && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">¿Cómo ganar más Educoins?</h3>
                <div className="space-y-2 text-blue-100">
                  <p>• Completa todas tus actividades a tiempo</p>
                  <p>• Obtén buenas calificaciones en tus tareas</p>
                  <p>• Participa activamente en clase</p>
                  <p>• Ayuda a tus compañeros</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}