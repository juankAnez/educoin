"use client"

import { useEffect, useState } from "react"
import { activityService } from "../../services/activities"
import { auctionService } from "../../services/auctions"
import { coinsService } from "../../services/coins"
import CoinBalance from "../coins/CoinBalance"
import LoadingSpinner from "../common/LoadingSpinner"

const StudentDashboard = () => {
  const [activities, setActivities] = useState([])
  const [auctions, setAuctions] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [act, auc, wal] = await Promise.all([
          activityService.getActivities(),
          auctionService.getAuctions(),
          coinsService.getWallet(),
        ])
        setActivities(act || [])
        setAuctions(auc || [])
        setWallet(wal[0] || null) // suponiendo que viene lista con un objeto
      } catch (error) {
        console.error("Error cargando dashboard de estudiante:", error)
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
      <h2 className="text-2xl font-bold text-foreground">¡Hola, Estudiante!</h2>
      <p className="text-muted-foreground">Completa actividades y gana Educoins para participar en subastas.</p>

      {/* Balance */}
      {wallet ? (
        <CoinBalance
          balance={wallet.balance || 0}
          totalEarned={wallet.total_earned || 0}
          totalSpent={wallet.total_spent || 0}
        />
      ) : (
        <p className="text-muted-foreground">No tienes aún un monedero asignado.</p>
      )}

      {/* Actividades pendientes */}
      <section>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Actividades Pendientes</h3>
        {activities.length > 0 ? (
          <ul className="space-y-3">
            {activities.map((act) => (
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
          <p className="text-muted-foreground">No tienes actividades pendientes.</p>
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
                <p className="text-xs text-muted-foreground mt-1">Premio: {auc.premio}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No hay subastas activas.</p>
        )}
      </section>
    </div>
  )
}

export default StudentDashboard
