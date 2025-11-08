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
} from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"
import { formatCoins } from "../../utils/helpers"
import { USER_ROLES } from "../../utils/constants"
import { useWallet } from "../../hooks/useWallet"

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthContext()
  const { data: walletData, isLoading: walletLoading } = useWallet()
  const isStudent = user?.role === USER_ROLES.STUDENT

  const userNavigation = [
    { name: "Tu Perfil", href: "/profile", icon: UserIcon },
    { name: "Cerrar Sesión", href: "#", icon: ArrowRightOnRectangleIcon, onClick: logout },
  ]

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button type="button" className="lg:hidden text-gray-700" onClick={onMenuClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-x-4">
        {/* Saldo del estudiante */}
        {isStudent && walletData && (
          <div className="flex items-center gap-x-2 px-3 py-1 bg-orange-100 rounded-full">
            <CurrencyEuroIcon className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">
              {walletData.saldo || 0} EC
            </span>
          </div>
        )}

        {/* Notifications */}
        <button type="button" className="p-2 text-orange-400 hover:text-orange-500">
          <BellIcon className="h-6 w-6" />
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-300 flex items-center justify-center text-white">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </div>
            <span className="hidden ml-2 text-sm font-semibold text-gray-900 lg:block">
              {user?.first_name} {user?.last_name}
            </span>
            <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500 hidden lg:block" />
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
            <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      to={item.href}
                      onClick={item.onClick}
                      className={`flex items-center px-3 py-2 text-sm ${
                        active ? "bg-gray-50" : ""
                      }`}
                    >
                      <item.icon className="mr-2 h-5 w-5 text-gray-400" />
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default Header
