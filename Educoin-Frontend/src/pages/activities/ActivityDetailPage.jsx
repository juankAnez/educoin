"use client"

import { motion } from "framer-motion"
import ActivityDetail from "../../components/activities/ActivityDetail"
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"

export default function ActivityDetailPage() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Detalle de Actividad</h1>
      </div>

      {/* Detalle */}
      <ActivityDetail />
    </motion.div>
  )
}
