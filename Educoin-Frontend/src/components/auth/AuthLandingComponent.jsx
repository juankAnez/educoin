"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import logo from "/educoin.png" // desde /public

export default function AuthLandingComponent() {
  const [activeForm, setActiveForm] = useState(null)

  const coins = Array.from({ length: 8 }, () => "/assets/coins/coin.png")

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Fondo animado suave */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100 opacity-80"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Monedas flotantes */}
      {coins.map((src, i) => {
        const size = 70 + Math.random() * 80
        const top = Math.random() * 90
        const left = Math.random() * 90
        const duration = 14 + Math.random() * 8
        const delay = Math.random() * 5

        return (
          <motion.img
            key={i}
            src={src}
            alt="Moneda Educoin"
            className="absolute opacity-30 select-none pointer-events-none"
            style={{
              width: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              zIndex: 0,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -30, 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}

      {/* Card principal */}
      <motion.div
        className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow:
            "0 0 30px rgba(249, 115, 22, 0.25), 0 0 60px rgba(249, 115, 22, 0.15)",
          border: "2px solid rgba(249,115,22,0.3)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* LEFT */}
        <motion.div
          className="relative bg-gradient-to-br from-[#f97316] to-[#ff8c1a] p-10 flex flex-col justify-between text-white"
          animate={{
            boxShadow: [
              "inset 0 0 20px rgba(255,255,255,0.2)",
              "inset 0 0 35px rgba(255,255,255,0.25)",
              "inset 0 0 20px rgba(255,255,255,0.2)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <motion.img
              src={logo}
              alt="Educoin"
              className="w-24 h-24 mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            />

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              ¡Bienvenido a Educoin!
            </h1>
            <p className="mt-3 text-lg opacity-95 max-w-sm">
              Convierte el aprendizaje en una aventura.  
              Gana monedas, sube de nivel y demuestra tu talento.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {["Aprendizaje", "Recompensas", "Retos", "Colaboración"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="bg-white/25 px-3 py-1 rounded-md text-sm backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="text-sm text-white/80 mt-6 text-center md:text-left">
            © 2025 Educoin — Aprende. Gana. Evoluciona.
          </div>
        </motion.div>

        {/* RIGHT - con glow */}
        <motion.div
          className="relative p-10 flex items-center justify-center bg-white/90 backdrop-blur-sm"
          style={{
            boxShadow:
              "inset 0 0 20px rgba(249,115,22,0.25), 0 0 25px rgba(249,115,22,0.15)",
            borderLeft: "2px solid rgba(249,115,22,0.3)",
          }}
          animate={{
            boxShadow: [
              "inset 0 0 20px rgba(249,115,22,0.25), 0 0 25px rgba(249,115,22,0.15)",
              "inset 0 0 35px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.2)",
              "inset 0 0 20px rgba(249,115,22,0.25), 0 0 25px rgba(249,115,22,0.15)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!activeForm && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-6 text-center text-lg">
                    Inicia sesión o crea tu cuenta y empieza a ganar Educoins mientras aprendes.
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={() => setActiveForm("register")}
                      className="w-full border-2 border-[#f97316] text-[#f97316] py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                    >
                      Crear una cuenta
                    </button>

                    <button
                      onClick={() => setActiveForm("login")}
                      className="w-full bg-[#f97316] text-white py-3 rounded-lg font-semibold hover:bg-[#e05e00] transition"
                    >
                      Iniciar sesión
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
                  transition={{ duration: 0.3 }}
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
                  transition={{ duration: 0.3 }}
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
        </motion.div>
      </motion.div>
    </div>
  )
}