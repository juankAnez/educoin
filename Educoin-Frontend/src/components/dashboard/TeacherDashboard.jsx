"use client"

import { useEffect, useState } from "react"
import { activityService } from "../../services/activities"
import { auctionService } from "../../services/auctions"
import api from "../../services/api"
import LoadingSpinner from "../common/LoadingSpinner"

const TeacherDashboard = () => {
  const [classrooms, setClassrooms] = useState([])
  const [activities, setActivities] = useState([])
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cls, act, auc] = await Promise.all([
          api.get("/users/api/v2/classrooms/"),
          activityService.getActivities(),
          auctionService.getAuctions(),
        ])
        setClassrooms(cls.data || [])
        setActivities(act || [])
        setAuctions(auc || [])
      } catch (error) {
        console.error("Error cargando dashboard de docente:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-background min-h-screen p-6">
      <h2 className="text-2xl font-bold text-foreground">¡Bienvenido, Profesor!</h2>
      <p className="text-muted-foreground">Gestiona tus clases y motiva a tus estudiantes con Educoins.</p>

      {/* Resumen */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm text-center">
          <p className="text-lg font-bold text-primary">{classrooms.length}</p>
          <p className="text-sm text-muted-foreground">Clases</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm text-center">
          <p className="text-lg font-bold text-primary">
            {classrooms.reduce((acc, c) => acc + (c.estudiantes?.length || 0), 0)}
          </p>
          <p className="text-sm text-muted-foreground">Estudiantes</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm text-center">
          <p className="text-lg font-bold text-primary">{activities.length}</p>
          <p className="text-sm text-muted-foreground">Actividades</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm text-center">
          <p className="text-lg font-bold text-primary">{auctions.length}</p>
          <p className="text-sm text-muted-foreground">Subastas</p>
        </div>
      </section>

      {/* Actividades recientes */}
      <section>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Actividades Recientes</h3>
        {activities.length > 0 ? (
          <ul className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <li
                key={act.id}
                className="p-4 border border-border rounded-lg bg-card shadow-sm hover:bg-card/80 transition"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-card-foreground">{act.nombre}</span>
                  <span className="text-primary font-semibold">{act.valor_educoins} Educoins</span>
                </div>
                <p className="text-sm text-muted-foreground">{act.descripcion || "Sin descripción"}</p>
                <p className="text-xs text-muted-foreground mt-1">Vence: {act.fecha_entrega}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No hay actividades creadas aún.</p>
        )}
      </section>

      {/* Subastas activas */}
      <section>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Subastas Activas</h3>
        {auctions.length > 0 ? (
          <ul className="space-y-3">
            {auctions.map((auc) => (
              <li
                key={auc.id}
                className="p-4 border border-border rounded-lg bg-card shadow-sm hover:bg-card/80 transition"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-card-foreground">{auc.titulo}</span>
                  <span className="text-primary font-semibold">
                    Termina: {new Date(auc.fecha_fin).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{auc.descripcion || "Sin descripción"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No hay subastas creadas aún.</p>
        )}
      </section>
    </div>
  )
}

export default TeacherDashboard
