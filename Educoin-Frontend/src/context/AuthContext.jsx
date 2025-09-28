"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { authService } from "../services/auth"
import { USER_ROLES } from "../utils/constants"

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = authService.getCurrentUser()
        const token = authService.getAccessToken()

        if (user && token) {
          // Verify token is still valid by fetching profile
          try {
            const updatedUser = await authService.getProfile()
            dispatch({ type: "SET_USER", payload: updatedUser })
          } catch (error) {
            // Token is invalid, clear auth data
            authService.logout()
            dispatch({ type: "LOGOUT" })
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const { user } = await authService.login(credentials)
      dispatch({ type: "SET_USER", payload: user })
      return user
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const result = await authService.register(userData)
      dispatch({ type: "SET_LOADING", payload: false })
      return result
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: "LOGOUT" })
  }

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    dispatch({ type: "SET_USER", payload: updatedUser })
  }

  const hasRole = (role) => {
    return state.user?.role === role
  }

  const isTeacher = () => hasRole(USER_ROLES.TEACHER)
  const isStudent = () => hasRole(USER_ROLES.STUDENT)
  const isAdmin = () => hasRole(USER_ROLES.ADMIN)

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isTeacher,
    isStudent,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
