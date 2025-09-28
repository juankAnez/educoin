"use client"

import { useState } from "react"
import { CurrencyDollarIcon, TrophyIcon, FireIcon, StarIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import CoinBalance from "../coins/CoinBalance"
import { formatCoins, formatDate } from "../../utils/helpers"

const StudentDashboard = () => {
  // Mock data - will be replaced with real API calls
  const [coinData] = useState({
    balance: 450,
    totalEarned: 1250,
    totalSpent: 800,
  })

  const [pendingActivities] = useState([
    {
      id: 1,
      title: "Tarea de Matemáticas - Capítulo 5",
      classroom: "Matemáticas 10A",
      reward: 50,
      dueDate: "2025-01-15",
      difficulty: "medium",
    },
    {
      id: 2,
      title: "Ensayo de Historia",
      classroom: "Historia 9B",
      reward: 75,
      dueDate: "2025-01-18",
      difficulty: "hard",
    },
    {
      id: 3,
      title: "Quiz de Ciencias",
      classroom: "Ciencias 11A",
      reward: 30,
      dueDate: "2025-01-12",
      difficulty: "easy",
    },
  ])

  const [activeAuctions] = useState([
    {
      id: 1,
      title: "Auriculares Bluetooth",
      currentBid: 200,
      myBid: 180,
      endDate: "2025-01-20",
      image: "/bluetooth-headphones.png",
    },
    {
      id: 2,
      title: "Libro de Programación",
      currentBid: 150,
      myBid: null,
      endDate: "2025-01-25",
      image: "/programming-book.png",
    },
  ])

  const [achievements] = useState([
    { name: "Primera Actividad", icon: StarIcon, earned: true },
    { name: "Racha de 7 días", icon: FireIcon, earned: true },
    { name: "100 Educoins", icon: CurrencyDollarIcon, earned: true },
    { name: "Ganador de Subasta", icon: TrophyIcon, earned: false },
  ])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "badge-success"
      case "medium":
        return "badge-warning"
      case "hard":
        return "badge-error"
      default:
        return "badge-info"
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Fácil"
      case "medium":
        return "Medio"
      case "hard":
        return "Difícil"
      default:
        return "Normal"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, Estudiante!</h1>
            <p className="mt-2 text-primary-100">Completa actividades y gana Educoins para participar en subastas</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100">Tu balance actual</p>
            <p className="text-3xl font-bold">{formatCoins(coinData.balance)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Activities */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Actividades Pendientes</h2>
              <Link to="/activities" className="text-sm text-educoin-600 hover:text-educoin-500">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {pendingActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.classroom}</p>
                    <p className="text-xs text-gray-400">Vence: {formatDate(activity.dueDate)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`badge ${getDifficultyColor(activity.difficulty)}`}>
                      {getDifficultyText(activity.difficulty)}
                    </span>
                    <span className="text-sm font-medium text-educoin-600">{activity.reward} Educoins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Auctions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Subastas Activas</h2>
              <Link to="/auctions" className="text-sm text-educoin-600 hover:text-educoin-500">
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {activeAuctions.map((auction) => (
                <div key={auction.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={auction.image || "/placeholder.svg"}
                    alt={auction.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{auction.title}</h3>
                    <p className="text-sm text-gray-500">Termina: {formatDate(auction.endDate)}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">
                        Puja actual: <span className="font-medium">{auction.currentBid} Educoins</span>
                      </span>
                      {auction.myBid && (
                        <span className="text-sm text-educoin-600">
                          Tu puja: <span className="font-medium">{auction.myBid} Educoins</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <Link to={`/auctions/${auction.id}`} className="btn-outline text-sm px-3 py-1">
                    {auction.myBid ? "Ver" : "Pujar"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Coin Balance */}
          <CoinBalance balance={coinData.balance} totalEarned={coinData.totalEarned} totalSpent={coinData.totalSpent} />

          {/* Progress & Ranking */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Progreso</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Nivel actual</span>
                  <span className="font-medium">Nivel 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-educoin-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">350/500 XP para siguiente nivel</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Ranking en tu clase</p>
                <div className="flex items-center">
                  <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-lg font-bold text-gray-900">#3</span>
                  <span className="text-sm text-gray-500 ml-2">de 25 estudiantes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros</h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-lg text-center ${
                    achievement.earned ? "bg-educoin-50 text-educoin-700" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <achievement.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{achievement.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
