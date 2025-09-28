"use client"

import { useState } from "react"
import { useJoinClassroom } from "../../hooks/useClassrooms"
import LoadingSpinner from "../common/LoadingSpinner"

const JoinClassroom = ({ onClose }) => {
  const joinClassroom = useJoinClassroom()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!code.trim()) {
      setError("El código de la clase es requerido")
      return
    }

    try {
      await joinClassroom.mutateAsync(code.trim().toUpperCase())
      onClose()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleChange = (e) => {
    setCode(e.target.value)
    if (error) {
      setError("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="code" className="label">
          Código de la Clase
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={handleChange}
          className={`input ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          placeholder="Ej: ABC123"
          maxLength={6}
          style={{ textTransform: "uppercase" }}
          required
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <p className="mt-1 text-sm text-gray-500">Ingresa el código de 6 caracteres proporcionado por tu profesor</p>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={joinClassroom.isPending} className="btn-primary flex-1">
          {joinClassroom.isPending ? <LoadingSpinner size="sm" /> : "Unirse"}
        </button>
      </div>
    </form>
  )
}

export default JoinClassroom
