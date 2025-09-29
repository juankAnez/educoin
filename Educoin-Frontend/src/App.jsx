"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Layout from "./components/common/Layout"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ClassroomsPage from "./pages/classrooms/ClassroomsPage"
import ClassroomDetailPage from "./pages/classrooms/ClassroomDetailPage"
import ActivitiesPage from "./pages/activities/ActivitiesPage"
import ActivityDetailPage from "./pages/activities/ActivityDetailPage"
import AuctionsPage from "./pages/auctions/AuctionsPage"
import ProfilePage from "./pages/profile/ProfilePage"
import LoadingSpinner from "./components/common/LoadingSpinner"

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />

      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="classrooms" element={<ClassroomsPage />} />
        <Route path="classrooms/:id" element={<ClassroomDetailPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="activities/:id" element={<ActivityDetailPage />} />
        <Route path="auctions" element={<AuctionsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  )
}

export default App
