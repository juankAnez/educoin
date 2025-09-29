"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth"
import api from "../services/api"
import { API_ENDPOINTS, USER_ROLES } from "../utils/constants"

const AuthContext = createContext()

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  // Cargar perfil si ya hay token
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("access_token")
      if (token) {
        try {
          const response = await api.get(API_ENDPOINTS.PROFILE)
          dispatch({ type: "SET_USER", payload: response.data.user })
        } catch (error) {
          console.error("Error cargando perfil:", error)
          handleLogout()
        }
      }
    }
    loadUserProfile()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await api.post(API_ENDPOINTS.LOGIN, credentials)
      const { user, tokens } = response.data

      // Guardar tokens y usuario
      localStorage.setItem("access_token", tokens.access)
      localStorage.setItem("refresh_token", tokens.refresh)
      localStorage.setItem("user", JSON.stringify(user))

      dispatch({ type: "SET_USER", payload: user })

      // Redirección según rol
      if (user.role === USER_ROLES.ADMIN) {
        window.location.href = "/admin" // Django admin
      } else if (user.role === USER_ROLES.TEACHER) {
        navigate("/dashboard/teacher")
      } else if (user.role === USER_ROLES.STUDENT) {
        navigate("/dashboard/student")
      }

      return user
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Error en login" })
      throw error
    }
  }

  const logout = () => {
    handleLogout()
    navigate("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
  }

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))
    dispatch({ type: "SET_USER", payload: updatedUser })
  }

  const registerUser = async (userData) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true })
    const response = await authService.register(userData)
    dispatch({ type: "SET_LOADING", payload: false })
    return response
  } catch (error) {
    dispatch({ type: "SET_ERROR", payload: error.message })
    dispatch({ type: "SET_LOADING", payload: false })
    throw error
  }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        dispatch,
        register: registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
