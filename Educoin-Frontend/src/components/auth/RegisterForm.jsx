"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useAuth } from "../../hooks/useAuth"
import { validateRegisterForm } from "../../utils/validators"
import LoadingSpinner from "../common/LoadingSpinner"
import toast from "react-hot-toast"

const RegisterForm = () => {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "", // Added password_confirm field for backend
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateRegisterForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      const registrationData = {
        ...formData,
        role: "estudiante",
        password_confirm: formData.password,
      }
      await register(registrationData)
      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión")
      navigate("/login")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-educoin-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background blur overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Floating modal container */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 p-8 space-y-8">
          <div>
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-educoin-500 to-educoin-600 shadow-lg">
              <span className="text-3xl font-bold text-white">E</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Únete a la plataforma Educoin como estudiante</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-educoin-500 focus:border-educoin-500 bg-white/50 backdrop-blur-sm transition-all duration-200 ${errors.first_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Tu nombre"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-educoin-500 focus:border-educoin-500 bg-white/50 backdrop-blur-sm transition-all duration-200 ${errors.last_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Tu apellido"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-educoin-500 focus:border-educoin-500 bg-white/50 backdrop-blur-sm transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-educoin-500 focus:border-educoin-500 bg-white/50 backdrop-blur-sm transition-all duration-200 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-educoin-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-educoin-600 to-educoin-700 hover:from-educoin-700 hover:to-educoin-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-educoin-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Crear Cuenta"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="font-medium text-educoin-600 hover:text-educoin-500 transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
