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
} from "@heroicons/react/24/outline"
import { useAuth } from "../../hooks/useAuth"

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isTeacher } = useAuth()
  const location = useLocation()

  const teacherNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Mis Clases", href: "/classrooms", icon: BookOpenIcon },
    { name: "Actividades", href: "/activities", icon: ClipboardDocumentListIcon },
    { name: "Subastas", href: "/auctions", icon: CurrencyDollarIcon },
    { name: "Perfil", href: "/profile", icon: UserIcon },
  ]

  const studentNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Mis Clases", href: "/classrooms", icon: BookOpenIcon },
    { name: "Subastas", href: "/auctions", icon: CurrencyDollarIcon },
    { name: "Perfil", href: "/profile", icon: UserIcon },
  ]

  const navigation = isTeacher ? teacherNavigation : studentNavigation

  const isCurrentPath = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + "/")
  }

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-midnight-700">
        <div className="flex items-center">
         <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-educoin-500">
          <span className="text-lg font-bold text-orange-500">E</span>
        </div>
        <span className="ml-3 text-xl font-bold text-foreground">Educoin</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-midnight-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-midnight-600 flex items-center justify-center">
            <span className="text-sm font-medium text-educoin-300">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-orange-500">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-midnight-300 capitalize">{user?.role}</p>
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
                current ? "bg-midnight-600 text-educoin-300" : "text-midnight-200 hover:bg-midnight-700 hover:text-orange-400"
              }`}
              onClick={onClose}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  current ? "text-educoin-300" : "text-midnight-400 group-hover:text-midnight-200"
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-midnight-700">
        <p className="text-xs text-midnight-400 text-center">© 2025 Plataforma Educoin</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
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
            <div className="fixed inset-0 bg-black/80" />
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
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-midnight-900">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-midnight-900 border-r border-midnight-700">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

export default Sidebar
