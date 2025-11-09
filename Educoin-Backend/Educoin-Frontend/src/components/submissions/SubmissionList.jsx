"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import Modal from "../common/Modal"
import GradeSubmission from "./GradeSubmission"

export default function SubmissionList({ submissions }) {
  const { isTeacher } = useAuth()
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  if (!submissions.length) return <p>No hay entregas aún.</p>

  return (
    <div className="space-y-4">
      {submissions.map((s) => (
        <div key={s.id} className="p-4 border rounded-md shadow-sm">
          <p className="font-semibold">Actividad: {s.activity_title || s.activity}</p>
          <p>Contenido: {s.contenido}</p>

          {s.archivo && (
            <a
              href={s.archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Ver archivo
            </a>
          )}

          <p className="text-sm mt-2">
            {s.calificacion ? (
              <>
                <b>Calificación:</b> {s.calificacion} | <b>Retro:</b> {s.retroalimentacion} |{" "}
                <b>Educoins:</b> {s.educoins || 0}
              </>
            ) : (
              "Sin calificar aún"
            )}
          </p>

          {isTeacher && (
            <button
              onClick={() => setSelectedSubmission(s)}
              className="btn-primary mt-3 text-sm"
            >
              Calificar
            </button>
          )}
        </div>
      ))}

      {/* Modal para calificar */}
      <Modal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title="Calificar Entrega"
        size="sm"
      >
        {selectedSubmission && (
          <GradeSubmission
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </Modal>
    </div>
  )
}
