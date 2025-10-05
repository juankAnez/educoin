"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { useAuthContext } from "../../context/AuthContext"
import { googleAuthService } from "../../services/googleAuth"
import { toast } from "react-hot-toast"

export default function RegisterForm({ onSwitchToLogin, googleButtonEvent }) {
  const { register: registerUser, login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        role: "estudiante",
      }
      await registerUser(payload)
      toast.success("Registro exitoso")
      await login({ email: payload.email, password: payload.password })
    } catch (err) {
      toast.error("Error en registro")
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
        await googleAuthService.loginWithGoogle(id_token)
        window.location.href = "/dashboard"
      } catch {
        toast.error("Google error")
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
      <h2 className="text-2xl font-semibold text-orange-600">Crear cuenta</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          placeholder="Nombre"
          {...register("first_name", { required: "Nombre requerido" })}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-300 outline-none"
        />
        <input
          placeholder="Apellido"
          {...register("last_name", { required: "Apellido requerido" })}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-300 outline-none"
        />
      </div>

      <input
        placeholder="Correo"
        type="email"
        {...register("email", { required: "Correo requerido" })}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-300 outline-none"
      />

      {/* Password */}
      <div className="relative">
        <input
          placeholder="Contraseña"
          type={showPassword ? "text" : "password"}
          {...register("password", {
            required: "Contraseña requerida",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
          className="w-full px-3 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-orange-300 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          placeholder="Confirmar contraseña"
          type={showConfirm ? "text" : "password"}
          {...register("password_confirm", {
            required: "Confirma tu contraseña",
            validate: (v) => v === password || "Las contraseñas no coinciden",
          })}
          className="w-full px-3 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-orange-300 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowConfirm((p) => !p)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showConfirm ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-60"
      >
        {isSubmitting ? "Registrando..." : "Crear cuenta"}
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
              toast.error("Google fallo")
            }
          }}
          onError={() => toast.error("Google error")}
        />
      </div>

      <p className="text-sm text-gray-600 text-center">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-orange-600 font-medium underline"
        >
          Inicia sesión aquí
        </button>
      </p>
    </form>
  )
}
