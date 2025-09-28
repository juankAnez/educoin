import axios from "axios"
import { API_BASE_URL } from "../utils/constants"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/api/v2/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          localStorage.setItem("access_token", access)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Handle other error statuses
    if (error.response?.status === 403) {
      console.error("Forbidden: You do not have permission to access this resource")
    } else if (error.response?.status === 404) {
      console.error("Not Found: The requested resource was not found")
    } else if (error.response?.status >= 500) {
      console.error("Server Error: Something went wrong on the server")
    }

    return Promise.reject(error)
  },
)

export default api
