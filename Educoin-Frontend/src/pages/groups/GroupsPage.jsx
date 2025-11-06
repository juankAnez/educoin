"use client"

import { useGroups } from "../../hooks/useGroups"
import { useAuthContext } from "../../context/AuthContext"
import JoinGroupCard from "../../components/groups/JoinGroupCard"
import GroupList from "../../components/groups/GroupList"
import LoadingSpinner from "../../components/common/LoadingSpinner"

export default function GroupsPage() {
  const { user } = useAuthContext()
  const { data: groups, isLoading } = useGroups()

  const isStudent = user?.role === "estudiante"
  const isTeacher = user?.role === "docente"

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis Grupos</h1>

      {/* SOLO ESTUDIANTES VEN EL CARD DE UNIRSE */}
      {isStudent && <JoinGroupCard />}

      {/* DOCENTES VEN LA LISTA CON OPCIÓN DE CREAR */}
      {isTeacher ? (
        <GroupList />
      ) : (
        // ESTUDIANTES VEN SUS GRUPOS SIN OPCIONES DE GESTIÓN
        <>
          {groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h2 className="font-semibold text-gray-900 text-lg mb-2">{group.nombre}</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {group.descripcion || "Sin descripción"}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>
                      <span className="font-medium">Estudiantes:</span>{" "}
                      {group.estudiantes?.length || 0}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span>{" "}
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          group.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {group.activo ? "Activo" : "Inactivo"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">Aún no estás en ningún grupo.</p>
              <p className="text-sm text-gray-500 mt-2">
                Usa el código que te dio tu profesor para unirte
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}