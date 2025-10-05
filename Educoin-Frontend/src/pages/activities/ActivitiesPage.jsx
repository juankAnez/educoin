import { useActivities } from "../../hooks/useActivities"
import LoadingSpinner from "../../components/common/LoadingSpinner"

export default function ActivitiesPage() {
  const { activities, loadingActivities } = useActivities()

  if (loadingActivities)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Actividades</h1>
      <div className="grid gap-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="p-4 border border-gray-300 rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{act.nombre}</h2>
            <p className="text-sm text-gray-600">{act.descripcion}</p>
            <p className="mt-1 text-sm">
              Valor Educoins: {act.valor_educoins} | Valor Nota: {act.valor_notas}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Entrega: {new Date(act.fecha_entrega).toLocaleDateString("es-CO")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
