"use client"

import { Link } from "react-router-dom"
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useCompleteActivity } from "../../hooks/useActivities"
import { formatDate, formatCoins, truncateText } from "../../utils/helpers"
import { ACTIVITY_STATUS } from "../../utils/constants"

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const { isTeacher, isStudent } = useAuth()
  const completeActivity = useCompleteActivity()

  const handleComplete = async () => {
    try {
      await completeActivity.mutateAsync(activity.id)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case ACTIVITY_STATUS.COMPLETED:
        return "badge-success"
      case ACTIVITY_STATUS.ACTIVE:
        return "badge-warning"
      default:
        return "badge-info"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case ACTIVITY_STATUS.COMPLETED:
        return "Completada"
      case ACTIVITY_STATUS.ACTIVE:
        return "Activa"
      default:
        return "Pendiente"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const canComplete = isStudent && activity.status === ACTIVITY_STATUS.ACTIVE

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
            <p className="text-sm text-gray-500">{activity.group_name || activity.group?.name}</p>
          </div>
        </div>

        {isTeacher && (
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(activity)}
                      className={`group flex w-full items-center px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <PencilIcon className="mr-3 h-4 w-4" />
                      Editar
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(activity)}
                      className={`group flex w-full items-center px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-red-900" : "text-red-700"
                      }`}
                    >
                      <TrashIcon className="mr-3 h-4 w-4" />
                      Eliminar
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>

      <p className="text-gray-600 mb-4">{truncateText(activity.description, 120)}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">{formatCoins(activity.reward_coins)}</span>
          </div>
          {activity.due_date && (
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-500">{formatDate(activity.due_date)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activity.difficulty && (
            <span className={`badge text-xs ${getDifficultyColor(activity.difficulty)}`}>
              {activity.difficulty === "easy" ? "Fácil" : activity.difficulty === "medium" ? "Medio" : "Difícil"}
            </span>
          )}
          <span className={`badge ${getStatusColor(activity.status)}`}>{getStatusText(activity.status)}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        {canComplete && (
          <button onClick={handleComplete} disabled={completeActivity.isPending} className="btn-primary flex-1 text-sm">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            {completeActivity.isPending ? "Completando..." : "Completar"}
          </button>
        )}
        <Link
          to={`/activities/${activity.id}`}
          className={`btn-outline text-center text-sm ${canComplete ? "flex-1" : "w-full"}`}
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  )
}

export default ActivityCard
