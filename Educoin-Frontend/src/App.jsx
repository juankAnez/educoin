"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthContext } from "./context/AuthContext"

// Layout principal y pantallas
import Layout from "./components/common/Layout"
import AuthLandingPage from "./pages/auth/AuthLandingPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ClassroomsPage from "./pages/classrooms/ClassroomsPage"
import GroupsPage from "./pages/groups/GroupsPage"
import ClassroomDetailPage from "./pages/classrooms/ClassroomDetailPage"
import GroupDetailPage from "./pages/groups/GroupDetailPage"
import ActivitiesPage from "./pages/activities/ActivitiesPage"
import ActivityDetailPage from "./pages/activities/ActivityDetailPage"
import AuctionsPage from "./pages/auctions/AuctionsPage"
import AuctionDetailPage from "./pages/auctions/AuctionDetailPage"
import ProfilePage from "./pages/profile/ProfilePage"
import WalletPage from "./pages/wallet/WalletPage"

// Pantallas y componentes comunes
import LoadingScreen from "./components/common/LoadingScreen"

function App() {
  const { isAuthenticated, isLoading, logout } = useAuthContext()

  console.log("Auth state:", { isAuthenticated, isLoading })

  // Listener global para logout
  useEffect(() => {
    const handleLogout = () => {
      logout()
    }

    window.addEventListener("educoin:logout", handleLogout)
    return () => window.removeEventListener("educoin:logout", handleLogout)
  }, [logout])

  // Pantalla de carga global
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      {!isAuthenticated && (
        <>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </>
      )}

      {/* RUTAS PRIVADAS */}
      {isAuthenticated && (
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="classrooms" element={<ClassroomsPage />} />
          <Route path="classrooms/:id" element={<ClassroomDetailPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupDetailPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="activities/:id" element={<ActivityDetailPage />} />
          <Route path="auctions" element={<AuctionsPage />} />
          <Route path="auctions/:id" element={<AuctionDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wallet" element={<WalletPage />} />
        </Route>
      )}

      {/* Catch-all */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  )
}

export default App