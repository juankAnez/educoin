import { useState } from "react"
import { useWallet, useAllWallets, usePeriods, useTransactions } from "../../hooks/useWallet"
import { useAuthContext } from "../../context/AuthContext"
import {
  CurrencyEuroIcon,
  WalletIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { formatDate } from "../../utils/helpers"

export default function WalletPage() {
  const { user } = useAuthContext()
  const { data: mainWallet, isLoading: mainLoading } = useWallet()
  const { data: allWallets, isLoading: walletsLoading } = useAllWallets()
  const { data: transactions, isLoading: transactionsLoading } = useTransactions()
  
  // Solo intentar cargar períodos si es docente
  const isTeacher = user?.role === "docente"
  const { data: periods } = usePeriods(isTeacher)

  if (mainLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Calcular totales de transacciones
  const totalGanado = transactions
    ?.filter((t) => t.tipo === "earn") // Cambiar de "ingreso" a "earn"
    .reduce((acc, t) => acc + (t.cantidad || 0), 0) || 0

  const totalGastado = transactions
    ?.filter((t) => t.tipo === "spend") // Cambiar de "egreso" a "spend"
    .reduce((acc, t) => acc + (t.cantidad || 0), 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Billetera</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tus Educoins y revisa tus transacciones
        </p>
      </div>

      {/* Balance Principal */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <WalletIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-orange-100 text-sm">Balance Total</p>
              <h2 className="text-4xl font-bold">{mainWallet?.saldo || 0} EC</h2>
            </div>
          </div>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span className="text-sm">Total Ganado</span>
            </div>
            <p className="text-2xl font-bold">{totalGanado} EC</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <ArrowTrendingDownIcon className="h-4 w-4" />
              <span className="text-sm">Total Gastado</span>
            </div>
            <p className="text-2xl font-bold">{totalGastado} EC</p>
          </div>
        </div>
      </div>

      {/* Billeteras por Grupo */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Billeteras por Grupo
          </h2>
        </div>

        {walletsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : allWallets && allWallets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {wallet.grupo_nombre || "Grupo"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {wallet.periodo_nombre || "Período"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Saldo:</span>
                    <span className="text-xl font-bold text-orange-600">
                      {wallet.saldo || 0} EC
                    </span>
                  </div>

                  {wallet.bloqueado > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bloqueado:</span>
                      <span className="font-medium text-red-600">
                        {wallet.bloqueado} EC
                      </span>
                    </div>
                  )}

                  {wallet.fecha_creacion && (
                    <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Creada el {formatDate(wallet.fecha_creacion)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <WalletIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p>No tienes billeteras creadas aún</p>
            <p className="text-sm mt-2">
              Las billeteras se crean automáticamente al unirte a un grupo
            </p>
          </div>
        )}
      </div>

      {/* Historial de Transacciones */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Historial de Transacciones
        </h2>

        {transactionsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.tipo === "earn" 
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.tipo === "earn" ? (
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.descripcion || "Transacción"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.fecha)}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-lg font-bold ${
                    transaction.tipo === "earn"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.tipo === "earn" ? "+" : "-"}
                  {transaction.monto} EC
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No hay transacciones registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}