"use client"

import { Link } from "react-router-dom"
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  Squares2X2Icon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useAuthContext } from "../../context/AuthContext"
import { formatDate, truncateText } from "../../utils/helpers"

const ClassroomCard = ({ classroom, onEdit, onDelete }) => {
  const { isTeacher } = useAuthContext()

  return (
    <div className="card border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AcademicCapIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {classroom?.nombre}
            </h3>
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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(classroom)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center px-3 py-2 text-sm text-gray-700`}
                    >
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Editar
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(classroom)}
                      className={`${
                        active ? "bg-red-50" : ""
                      } flex w-full items-center px-3 py-2 text-sm text-red-600`}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Eliminar
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>

      <p className="text-gray-600 mb-4">
        {truncateText(classroom?.descripcion || "Sin descripción", 120)}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{classroom?.student_count || 0} estudiantes</span>
          </div>
          <div className="flex items-center">
            <Squares2X2Icon className="h-4 w-4 mr-1" />
            <span>{classroom?.group_count || 0} grupos</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formatDate(classroom?.created_at)}</span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            classroom?.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {classroom?.is_active ? "Activa" : "Inactiva"}
        </span>
      </div>

      <Link
        to={`/classrooms/${classroom.id}`}
        className="btn-primary w-full text-center"
      >
        Ver Detalles
      </Link>
    </div>
  )
}

export default ClassroomCard
