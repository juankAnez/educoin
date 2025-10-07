"use client"

import { useState } from "react"
import { useJoinGroup } from "../../hooks/useGroups"
import { KeyIcon } from "@heroicons/react/24/outline"

export default function JoinGroupCard() {
  const [code, setCode] = useState("")
  const { mutate: joinGroup, isPending } = useJoinGroup()

  const handleJoin = () => {
    if (!code.trim()) return
    joinGroup({ code })
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border flex flex-col items-center text-center">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-3">
        <KeyIcon className="h-6 w-6 text-orange-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Unirse a un Grupo</h2>
      <p className="text-sm text-gray-500 mb-4">
        Ingresa el código que tu docente te compartió para unirte al grupo.
      </p>
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ej: ABC123"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        />
        <button
          onClick={handleJoin}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg font-medium text-white transition ${
            isPending ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isPending ? "Uniendo..." : "Unirse"}
        </button>
      </div>
    </div>
  )
}
