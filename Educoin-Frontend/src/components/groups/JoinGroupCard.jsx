import { useState } from "react"
import { useJoinGroup } from "../../hooks/useGroups"
import { UserGroupIcon } from "@heroicons/react/24/outline"

export default function JoinGroupCard() {
  const [code, setCode] = useState("")
  const joinMutation = useJoinGroup()

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!code.trim()) return

    try {
      await joinMutation.mutateAsync({ code: code.trim().toUpperCase() })
      setCode("")
    } catch (error) {
      console.error("Error uniéndose al grupo:", error)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <UserGroupIcon className="h-8 w-8" />
        <div>
          <h2 className="text-xl font-bold">Unirse a un Grupo</h2>
          <p className="text-blue-100 text-sm">
            Ingresa el código que te compartió tu docente
          </p>
        </div>
      </div>

      <form onSubmit={handleJoin} className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código del grupo (ej: ABC123)"
          maxLength={6}
          className="flex-1 px-4 py-2.5 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          disabled={!code.trim() || joinMutation.isPending}
          className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joinMutation.isPending ? "Uniéndose..." : "Unirse"}
        </button>
      </form>
    </div>
  )
}