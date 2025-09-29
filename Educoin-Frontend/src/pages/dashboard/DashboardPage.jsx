"use client"

import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import TeacherDashboard from "../../components/dashboard/TeacherDashboard"
import StudentDashboard from "../../components/dashboard/StudentDashboard"
import { USER_ROLES } from "../../utils/constants"

const DashboardPage = () => {
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === USER_ROLES.ADMIN) {
      // Redirigir al panel de Django admin
      window.location.href = "http://localhost:8000/admin/"
    }
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Cargando usuario...</h2>
        <p className="text-gray-600">Por favor espera.</p>
      </div>
    )
  }

  if (user.role === USER_ROLES.TEACHER) {
    return <TeacherDashboard />
  }

  if (user.role === USER_ROLES.STUDENT) {
    return <StudentDashboard />
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-gray-900">Rol de usuario no reconocido</h2>
      <p className="text-gray-600">Ve a tu perfil para revisar tu rol o contacta al administrador.</p>
    </div>
  )
}

export default DashboardPage
