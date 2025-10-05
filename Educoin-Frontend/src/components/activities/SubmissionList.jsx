export default function SubmissionList({ submissions }) {
  if (!submissions.length) return <p>No hay entregas aún.</p>

  return (
    <div className="space-y-4">
      {submissions.map((s) => (
        <div key={s.id} className="p-3 border rounded-md">
          <p className="font-semibold">Actividad: {s.activity}</p>
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
                Calificación: <b>{s.calificacion}</b> | Retro: {s.retroalimentacion}
              </>
            ) : (
              "Sin calificar aún"
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
