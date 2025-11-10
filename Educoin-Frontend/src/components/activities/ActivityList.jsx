import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useActivities, useDeleteActivity } from "../../hooks/useActivities";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";
import CreateActivity from "./CreateActivity";

const ActivityList = () => {
  const { user } = useAuthContext();
  const isTeacher = user?.role === "docente";
  const isStudent = user?.role === "estudiante";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const { data: activities, isLoading, refetch } = useActivities();
  const deleteActivity = useDeleteActivity();

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta actividad?")) {
      await deleteActivity.mutateAsync(id);
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingActivity(null);
    refetch();
  };

  // Filtrado usando user_submission
  const filteredActivities = activities?.filter((activity) => {
    const matchesSearch =
      activity.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !typeFilter || activity.tipo === typeFilter;

    if (isStudent) {
      const hasSubmission = activity.user_submission !== null && activity.user_submission !== undefined;
      
      if (statusFilter === "pendientes") {
        return matchesSearch && matchesType && !hasSubmission;
      } else if (statusFilter === "completadas") {
        return matchesSearch && matchesType && hasSubmission;
      }
    }

    return matchesSearch && matchesType;
  }) || [];

  // Estadísticas actualizadas para usar user_submission
  const stats = {
    total: activities?.length || 0,
    pendientes: isStudent 
      ? activities?.filter(a => !a.user_submission).length || 0
      : 0,
    completadas: isStudent
      ? activities?.filter(a => a.user_submission).length || 0
      : 0,
    calificadas: isStudent
      ? activities?.filter(a => a.user_submission?.calificacion !== null && a.user_submission?.calificacion !== undefined).length || 0
      : 0
  };

  const getActivityIcon = (tipo) => {
    const icons = {
      tarea: ClipboardDocumentCheckIcon,
      examen: AcademicCapIcon,
      proyecto: CheckCircleIcon,
      quiz: ClockIcon,
      exposicion: CalendarIcon
    };
    return icons[tipo] || ClipboardDocumentCheckIcon;
  };

  // Estado de la actividad actualizado para usar user_submission
  const getActivityStatus = (activity) => {
    if (isStudent) {
      const hasSubmission = activity.user_submission !== null && activity.user_submission !== undefined;
      
      if (!hasSubmission) {
        return {
          label: activity.esta_vencida ? "Vencida" : "Pendiente",
          color: activity.esta_vencida ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700",
          icon: XCircleIcon
        };
      }
      
      if (activity.user_submission?.calificacion !== null && activity.user_submission?.calificacion !== undefined) {
        return {
          label: "Calificada",
          color: "bg-green-100 text-green-700",
          icon: CheckCircleIcon,
          grade: activity.user_submission.calificacion
        };
      }
      
      return {
        label: "Entregada",
        color: "bg-blue-100 text-blue-700",
        icon: ClockIcon
      };
    }
    
    return {
      label: activity.habilitada ? "Activa" : "Inactiva",
      color: activity.habilitada ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header con botón para crear actividad (solo docentes) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Actividades Asignadas</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {isTeacher ? "Gestiona las actividades de tus grupos" : "Consulta tus actividades, entrega tus trabajos y revisa tus calificaciones."}
          </p>
        </div>
        {isTeacher && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2.5 rounded-lg hover:bg-purple-600 transition text-sm sm:text-base w-full sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Nueva Actividad
          </button>
        )}
      </div>

      {isStudent && (
        <>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Mi Progreso</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-purple-100">Total</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.pendientes}</div>
                <div className="text-sm text-purple-100">Pendientes</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.completadas}</div>
                <div className="text-sm text-purple-100">Completadas</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.calificadas}</div>
                <div className="text-sm text-purple-100">Calificadas</div>
              </div>
            </div>
          </div>

          {/* Sección de Avance de Proyecto */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Avance Proyecto</h3>
            <p className="text-gray-600">Avance de Proyecto de software</p>
          </div>
        </>
      )}

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {isStudent && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              <option value="pendientes">Pendientes</option>
              <option value="completadas">Completadas</option>
            </select>
          )}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="tarea">Tareas</option>
            <option value="examen">Exámenes</option>
            <option value="proyecto">Proyectos</option>
            <option value="quiz">Quizzes</option>
            <option value="exposicion">Exposiciones</option>
          </select>
        </div>
      </div>

      {/* Lista de actividades */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividades</h2>
        <p className="text-gray-600 mb-6">Completa actividades para ganar Educoins</p>
        
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.tipo);
              const status = getActivityStatus(activity);
              const submission = activity.user_submission;

              return (
                <div
                  key={activity.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-purple-600 uppercase">
                            {activity.tipo}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                      {activity.nombre}
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
                      {activity.descripcion || "Sin descripción"}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <CurrencyEuroIcon className="h-4 w-4" />
                          <span>Recompensa:</span>
                        </div>
                        <span className="font-bold text-orange-600">
                          {activity.valor_educoins} EC
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <AcademicCapIcon className="h-4 w-4" />
                          <span>Valor:</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {activity.valor_notas} pts
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Entrega:</span>
                        </div>
                        <span className={`font-medium text-sm ${
                          activity.esta_vencida ? "text-red-600" : "text-gray-900"
                        }`}>
                          {new Date(activity.fecha_entrega).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>

                      {activity.tiempo_restante && !activity.esta_vencida && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <ClockIcon className="h-4 w-4" />
                            <span>Tiempo:</span>
                          </div>
                          <span className="font-medium text-orange-600 text-sm">
                            {activity.tiempo_restante}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mostrar calificación usando user_submission */}
                    {isStudent && submission?.calificacion !== null && submission?.calificacion !== undefined && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700">
                            Tu calificación:
                          </span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-700">
                              {submission.calificacion}
                            </span>
                            <span className="text-sm text-green-600">
                              /{activity.valor_notas}
                            </span>
                          </div>
                        </div>
                        {submission.retroalimentacion && (
                          <p className="text-xs text-green-600 mt-2 line-clamp-2">
                            {submission.retroalimentacion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-5">
                    {isStudent ? (
                      <Link
                        to={`/activities/${activity.id}`}
                        className="block w-full text-center bg-purple-500 text-white px-4 py-2.5 rounded-lg hover:bg-purple-600 transition font-medium"
                      >
                        {submission ? "Ver Entrega" : "Ver Detalles"}
                      </Link>
                    ) : (
                      <div className="flex gap-2">
                        <Link
                          to={`/activities/${activity.id}`}
                          className="flex-1 text-center bg-purple-50 text-purple-600 px-4 py-2.5 rounded-lg hover:bg-purple-100 transition font-medium text-sm"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleEdit(activity)}
                          className="px-4 py-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition flex items-center justify-center"
                          title="Editar actividad"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center"
                          title="Eliminar actividad"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <ClipboardDocumentCheckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron actividades
            </h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              {searchTerm || typeFilter || statusFilter !== "todas"
                ? "Intenta con otros filtros"
                : isTeacher
                ? "Crea tu primera actividad para empezar"
                : "No hay actividades asignadas aún"}
            </p>
            {isTeacher && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition inline-flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Crear Primera Actividad
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal para crear/editar actividad */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingActivity ? "Editar Actividad" : "Nueva Actividad"}
        size="lg"
      >
        <CreateActivity 
          activity={editingActivity} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default ActivityList;