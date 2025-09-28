"use client"

import { useAuth } from "../../hooks/useAuth"
import TeacherDashboard from "../../components/dashboard/TeacherDashboard"
import StudentDashboard from "../../components/dashboard/StudentDashboard"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const DashboardPage = () => {
  const { user, isTeacher, isStudent, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar la información del usuario</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {isTeacher() && <TeacherDashboard />}
      {isStudent() && <StudentDashboard />}
      {!isTeacher() && !isStudent() && (
        <div className="text-center py-12">
          <p className="text-gray-500">Rol de usuario no reconocido</p>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
