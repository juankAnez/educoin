"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { useAuthContext } from "../../context/AuthContext"
import { googleAuthService } from "../../services/googleAuth"
import { toast } from "react-hot-toast"

export default function LoginForm({ onSwitchToRegister, googleButtonEvent }) {
  const { login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await login({ email: data.email, password: data.password })
      toast.success("Inicio de sesión correcto")
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al iniciar sesión")
    }
  }

  // Google login
  const googleOpen = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const id_token =
          tokenResponse.id_token ||
          tokenResponse.credential ||
          tokenResponse.access_token
        if (!id_token) throw new Error("No se pudo obtener token de Google")
        await googleAuthService.loginWithGoogle(id_token)
        window.location.href = "/dashboard"
      } catch (err) {
        toast.error("Error con Google")
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-semibold text-orange-600">Iniciar sesión</h2>

      <div>
        <label className="block text-sm font-medium">Correo</label>
        <input
          type="email"
          {...register("email", { required: "Correo es requerido" })}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-300 outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Contraseña requerida" })}
            className="w-full px-3 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-orange-300 outline-none"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Iniciar sesión"}
      </button>

      <div className="text-center text-gray-400">o</div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (res) => {
            try {
              const id_token =
                res.credential || res.id_token || res.access_token
              await googleAuthService.loginWithGoogle(id_token)
              window.location.href = "/dashboard"
            } catch {
              toast.error("No fue posible iniciar con Google")
            }
          }}
          onError={() => toast.error("Google login falló")}
        />
      </div>

      <p className="text-sm text-gray-600 text-center">
        ¿No tienes una cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-orange-600 font-medium underline"
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  )
}
