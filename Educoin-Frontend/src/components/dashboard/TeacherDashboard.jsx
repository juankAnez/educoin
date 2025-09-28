"use client"

import { useState } from "react"
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"

const TeacherDashboard = () => {
  // Mock data - will be replaced with real API calls
  const [stats] = useState({
    totalClasses: 5,
    totalStudents: 127,
    activeActivities: 12,
    activeAuctions: 3,
  })

  const [recentActivities] = useState([
    {
      id: 1,
      title: "Tarea de Matemáticas - Capítulo 5",
      classroom: "Matemáticas 10A",
      reward: 50,
      status: "active",
      dueDate: "2025-01-15",
    },
    {
      id: 2,
      title: "Ensayo de Historia",
      classroom: "Historia 9B",
      reward: 75,
      status: "completed",
      dueDate: "2025-01-10",
    },
    {
      id: 3,
      title: "Proyecto de Ciencias",
      classroom: "Ciencias 11A",
      reward: 100,
      status: "active",
      dueDate: "2025-01-20",
    },
  ])

  const quickActions = [
    {
      name: "Crear Clase",
      href: "/classrooms?action=create",
      icon: AcademicCapIcon,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Nueva Actividad",
      href: "/activities?action=create",
      icon: ClipboardDocumentListIcon,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Crear Subasta",
      href: "/auctions?action=create",
      icon: ShoppingBagIcon,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-educoin-500 to-educoin-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">¡Bienvenido, Profesor!</h1>
            <p className="mt-2 text-educoin-100">Gestiona tus clases y motiva a tus estudiantes con Educoins</p>
          </div>
          <ChartBarIcon className="h-16 w-16 text-educoin-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Clases" value={stats.totalClasses} icon={AcademicCapIcon} color="bg-blue-500" />
        <StatCard title="Total de Estudiantes" value={stats.totalStudents} icon={UserGroupIcon} color="bg-green-500" />
        <StatCard
          title="Actividades Activas"
          value={stats.activeActivities}
          icon={ClipboardDocumentListIcon}
          color="bg-yellow-500"
        />
        <StatCard title="Subastas Activas" value={stats.activeAuctions} icon={ShoppingBagIcon} color="bg-purple-500" />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-colors ${action.color}`}
            >
              <action.icon className="h-5 w-5 mr-2" />
              {action.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Actividades Recientes</h2>
          <Link to="/activities" className="text-sm text-educoin-600 hover:text-educoin-500">
            Ver todas
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.classroom}</p>
                <p className="text-xs text-gray-400">Vence: {activity.dueDate}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-educoin-600">{activity.reward} Educoins</span>
                <span className={`badge ${activity.status === "active" ? "badge-warning" : "badge-success"}`}>
                  {activity.status === "active" ? "Activa" : "Completada"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento General</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Gráfico de rendimiento próximamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
