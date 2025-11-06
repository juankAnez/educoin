"use client"

import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"
import { Dialog, Transition } from "@headlessui/react"
import {
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ArrowRightCircleIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"
import { useAuthContext } from "../../context/AuthContext"
import { USER_ROLES } from "../../utils/constants"

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthContext()
  const location = useLocation()

  const teacherNavigation = [
    { name: "Panel Docente", href: "/dashboard", icon: HomeIcon },
    { name: "Mis Clases", href: "/classrooms", icon: BookOpenIcon },
    { name: "Mis Grupos", href:"/groups", icon: UserGroupIcon},
    { name: "Mis Actividades", href: "/activities", icon: ClipboardDocumentListIcon },
    { name: "Subastas", href: "/auctions", icon: CurrencyDollarIcon },
    { name: "Perfil", href: "/profile", icon: UserIcon },
  ]

  const studentNavigation = [
    { name: "Panel Estudiante", href: "/dashboard", icon: HomeIcon },
    { name: "Grupos", href:"/groups", icon: UserGroupIcon},
    { name: "Actividades", href: "/activities", icon: ClipboardDocumentListIcon },
    { name: "Subastas", href: "/auctions", icon: CurrencyDollarIcon },
    { name: "Perfil", href: "/profile", icon: UserIcon },
  ]

  const adminNavigation = [
    { name: "Dashboard Admin", href: "/dashboard", icon: HomeIcon },
    { name: "Admin Django", href: "http://localhost:8000/admin/", icon: ArrowRightCircleIcon },
  ]

  const navigation =
    user?.role === USER_ROLES.TEACHER
      ? teacherNavigation
      : user?.role === USER_ROLES.ADMIN
      ? adminNavigation
      : studentNavigation

  const isCurrentPath = (href) =>
    location.pathname === href || location.pathname.startsWith(href + "/")

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <img src="/educoin.png" alt="Educoin" className="h-10 w-10" />
        <span className="ml-3 text-xl font-bold text-orange-600">Educoin</span>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">
            <span className="text-sm font-medium text-orange-700">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const current = isCurrentPath(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                current
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
              }`}
              onClick={onClose}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  current
                    ? "text-orange-600"
                    : "text-gray-400 group-hover:text-orange-500"
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full text-sm text-red-500 hover:text-red-600 transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <SidebarContent />
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar
