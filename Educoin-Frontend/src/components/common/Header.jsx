"use client"

import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  CurrencyEuroIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"
import { formatCoins } from "../../utils/helpers"
import { USER_ROLES } from "../../utils/constants"
import { useWallet } from "../../hooks/useWallet"
import NotificationsDropdown from '../notifications/NotificationsDropdown'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthContext()
  const { data: walletData, isLoading: walletLoading } = useWallet()
  const isStudent = user?.role === USER_ROLES.STUDENT
  const isTeacher = user?.role === USER_ROLES.TEACHER
  const isAdmin = user?.role === USER_ROLES.ADMIN

  const userNavigation = [
    { name: "Tu Perfil", href: "/profile", icon: UserIcon },
    ...(isAdmin ? [{ name: "Admin Django", href: "http://localhost:8000/admin/", icon: Cog6ToothIcon }] : []),
    { name: "Cerrar Sesión", href: "#", icon: ArrowRightOnRectangleIcon, onClick: logout },
  ]

  return (
    <div className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button 
        type="button" 
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-gray-900"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-x-4">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full border border-blue-200">
          <AcademicCapIcon className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700 capitalize">
            {user?.role}
          </span>
        </div>

        {/* Saldo del estudiante */}
        {isStudent && walletData && (
          <div className="flex items-center gap-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/25">
            <CurrencyEuroIcon className="h-5 w-5 text-white" />
            <span className="text-sm font-bold text-white">
              {formatCoins(walletData.saldo || 0)} EC
            </span>
          </div>
        )}

        {/* Notifications (open dropdown when pressing bell) */}
        <NotificationsDropdown />

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.first_name?.charAt(0)}
                {user?.last_name?.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
          </Menu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl ring-1 ring-gray-200/80 focus:outline-none overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.first_name?.charAt(0)}
                    {user?.last_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    {isStudent && walletData && (
                      <div className="flex items-center space-x-1 mt-1">
                        <CurrencyEuroIcon className="h-3 w-3 text-orange-500" />
                        <span className="text-xs font-medium text-orange-600">
                          {formatCoins(walletData.saldo || 0)} EC
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-2">
                {userNavigation.map((item) => {
                  const isExternal = item.href.startsWith('http')
                  const content = (
                    <div className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.onClick 
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    }`}>
                      <item.icon className={`mr-3 h-5 w-5 ${
                        item.onClick ? 'text-red-500' : 'text-gray-400'
                      }`} />
                      {item.name}
                      {isExternal && (
                        <ArrowRightOnRectangleIcon className="ml-auto h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  )

                  return (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        isExternal ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            {content}
                          </a>
                        ) : item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className="block w-full text-left"
                          >
                            {content}
                          </button>
                        ) : (
                          <Link to={item.href} className="block">
                            {content}
                          </Link>
                        )
                      )}
                    </Menu.Item>
                  )
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default Header