"use client"

import { Link } from "react-router-dom"
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useAuth } from "../../hooks/useAuth"
import { formatDate, truncateText } from "../../utils/helpers"

const ClassroomCard = ({ classroom, onEdit, onDelete }) => {
  const { isTeacher } = useAuth()

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-educoin-100 rounded-lg">
            <AcademicCapIcon className="h-6 w-6 text-educoin-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {classroom?.nombre}
            </h3>
            {/* Ajusta si tu backend tiene 'codigo' */}
            <p className="text-sm text-muted-foreground">
              Código: {classroom?.codigo || classroom?.code || ""}
            </p>
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-border">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(classroom)}
                      className={`group flex w-full items-center px-4 py-2 text-sm ${
                        active ? "bg-muted text-foreground" : "text-gray-700"
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
                      onClick={() => onDelete(classroom)}
                      className={`group flex w-full items-center px-4 py-2 text-sm ${
                        active ? "bg-muted text-red-900" : "text-red-700"
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

      <p className="text-muted-foreground mb-4">
        {truncateText(classroom?.descripcion || "", 120)}
      </p>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>
              {(classroom?.estudiantes?.length || classroom?.student_count) ?? 0}{" "}
              estudiantes
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>
              {formatDate(classroom?.creado || classroom?.created_at)}
            </span>
          </div>
        </div>
        <span
          className={`badge ${
            classroom?.is_active ? "badge-success" : "badge-error"
          }`}
        >
          {classroom?.is_active ? "Activa" : "Inactiva"}
        </span>
      </div>

      <Link to={`/classrooms/${classroom.id}`} className="btn-primary w-full text-center">
        Ver Detalles
      </Link>
    </div>
  )
}

export default ClassroomCard
