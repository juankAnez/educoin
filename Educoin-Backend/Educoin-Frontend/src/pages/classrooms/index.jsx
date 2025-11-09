"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import { API_ENDPOINTS, USER_ROLES } from "../../utils/constants"
import ClassroomCard from "../../components/classrooms/ClassroomCard"
import { useAuthContext } from "../../context/AuthContext"

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchClassrooms = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.CLASSROOMS)
      setClassrooms(res.data)
    } catch (err) {
      console.error("Error cargando clases:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClassroom = async () => {
    const name = prompt("Nombre de la nueva clase:")
    if (!name) return
    try {
      const res = await api.post(API_ENDPOINTS.CLASSROOMS, { nombre: name })
      setClassrooms([...classrooms, res.data])
    } catch (err) {
      alert("Error al crear clase.")
    }
  }

  if (loading) return <p className="text-center mt-10">Cargando clases...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Clases</h1>

        {user?.role === USER_ROLES.TEACHER && (
          <button
            onClick={handleCreateClassroom}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            + Nueva Clase
          </button>
        )}
      </div>

      {classrooms.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No hay clases registradas aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((cls) => (
            <ClassroomCard key={cls.id} classroom={cls} />
          ))}
        </div>
      )}
    </div>
  )
}
