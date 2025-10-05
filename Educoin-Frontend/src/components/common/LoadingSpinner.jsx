import React from "react"

export default function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/educoin.ico"
        alt="Educoin"
        className={`loading-logo ${sizes[size]} rounded-full`}
      />
      <div className="mt-3 text-sm text-gray-500">Cargando Educoin…</div>
    </div>
  )
}
