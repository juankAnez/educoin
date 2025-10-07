"use client"

import { useGroups } from "../../hooks/useGroups"
import JoinGroupCard from "../../components/groups/JoinGroupCard"
import LoadingSpinner from "../../components/common/LoadingSpinner"

export default function GroupsPage() {
  const { data: groups, isLoading } = useGroups()

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis Grupos</h1>

      <JoinGroupCard />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white border rounded-lg p-5 shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-900">{group.nombre}</h2>
              <p className="text-sm text-gray-500">
                Clase: {group.className || "Sin clase asociada"} 
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Código: <span className="font-mono font-bold text-orange-500">{group.codigo}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Aún no estás en ningún grupo.</p>
      )}
    </div>
  )
}
