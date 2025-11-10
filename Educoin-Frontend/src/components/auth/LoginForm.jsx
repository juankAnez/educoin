"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { useAuthContext } from "../../context/AuthContext"
import { googleAuthService } from "../../services/googleAuth"
import { toast } from "react-hot-toast"
import LoadingSpinner from "../common/LoadingSpinner"

export default function LoginForm({ onSwitchToRegister, googleButtonEvent, compact }) {
  const { login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login({ email: data.email, password: data.password })
      toast.success("¡Bienvenido de nuevo!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  // Google login
  const googleOpen = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        const id_token =
          tokenResponse.id_token ||
          tokenResponse.credential ||
          tokenResponse.access_token
        if (!id_token) throw new Error("No se pudo obtener token de Google")
        await googleAuthService.loginWithGoogle(id_token)
        toast.success("¡Bienvenido con Google!")
        window.location.href = "/dashboard"
      } catch (err) {
        toast.error("Error al iniciar sesión con Google")
        setIsLoading(false)
      }
    },
    flow: "implicit",
    scope: "openid profile email",
  })

  useEffect(() => {
    if (!googleButtonEvent) return
    const handler = () => googleOpen()
    window.addEventListener(googleButtonEvent, handler)
    return () => window.removeEventListener(googleButtonEvent, handler)
  }, [googleButtonEvent, googleOpen])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-2">Iniciar sesión</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Accede a tu cuenta para continuar aprendiendo
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            {...register("email", { 
              required: "El correo es requerido",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Correo electrónico inválido"
              }
            })}
            className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { 
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres"
                }
              })}
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-orange-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
      >
        {(isSubmitting || isLoading) ? (
          <>
            <LoadingSpinner size="sm" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </button>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative bg-white px-3 text-sm text-gray-500">o continúa con</div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (res) => {
            setIsLoading(true)
            try {
              const id_token = res.credential || res.id_token || res.access_token
              await googleAuthService.loginWithGoogle(id_token)
              toast.success("¡Bienvenido con Google!")
              window.location.href = "/dashboard"
            } catch {
              toast.error("No fue posible iniciar sesión con Google")
              setIsLoading(false)
            }
          }}
          onError={() => {
            toast.error("Error al conectar con Google")
            setIsLoading(false)
          }}
          theme="filled_blue"
          size="medium"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </div>

      <p className="text-sm text-gray-600 text-center">
        ¿No tienes una cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-orange-600 font-medium hover:text-orange-700 underline transition-colors"
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  )
}