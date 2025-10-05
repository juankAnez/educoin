"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import logo from "/educoin.png"

export default function AuthLandingComponent() {
  const [activeForm, setActiveForm] = useState(null) // null | "login" | "register"

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-orange-200">
      {/* Fondo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-700 to-orange-400"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Círculos decorativos */}
      <motion.div
        className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card centrada */}
      <motion.div
        className="relative w-full h-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* LEFT */}
        <div className="bg-gradient-to-br from-[#f97316] to-[#ff8c1a] p-10 flex flex-col justify-between text-white">
          <div className="flex flex-col items-center justify-center">
            <motion.img
              src={logo}
              alt="Educoin"
              className="w-28 h-28 mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
              Bienvenido a Educoin
            </h1>
            <p className="mt-3 text-lg text-center opacity-95">Aprende, gana y evoluciona.</p>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm inline-flex items-center gap-1">
                Aprendizaje
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm inline-flex items-center gap-1">
                Recompensas
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm inline-flex items-center gap-1">
                Colaboración
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm inline-flex items-center gap-1">
                Retos
              </span>
            </div>
          </div>

          {/* footer left */}
          <div className="text-sm text-white/80 mt-6 text-center md:text-left">
            © 2025 Educoin — Todos los derechos reservados.
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!activeForm && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="text-gray-600 mb-6 text-center">
                    Inicia sesión o crea una cuenta para continuar.
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={() => setActiveForm("register")}
                      className="w-full border-2 border-[#f97316] text-[#f97316] py-3 rounded-lg font-medium hover:bg-orange-50 transition"
                    >
                      Registro
                    </button>

                    <button
                      onClick={() => setActiveForm("login")}
                      className="w-full bg-[#f97316] text-white py-3 rounded-lg font-medium hover:bg-[#e05e00] transition"
                    >
                      Login
                    </button>
                  </div>
                </motion.div>
              )}

              {activeForm === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="mb-4">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="inline-flex items-center gap-2 text-[#f97316] hover:text-[#e05e00] font-medium"
                    >
                      ← Volver
                    </button>
                  </div>

                  <LoginForm
                    compact
                    onSwitchToRegister={() => setActiveForm("register")}
                    googleButtonEvent="google-btn-click"
                  />
                </motion.div>
              )}

              {activeForm === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="mb-4">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="inline-flex items-center gap-2 text-[#f97316] hover:text-[#e05e00] font-medium"
                    >
                      ← Volver
                    </button>
                  </div>

                  <RegisterForm
                    compact
                    onSwitchToLogin={() => setActiveForm("login")}
                    googleButtonEvent="google-btn-click"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
