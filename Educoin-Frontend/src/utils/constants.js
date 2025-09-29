export const API_BASE_URL = "http://localhost:8000"

export const API_ENDPOINTS = {
  // Auth
  REGISTER: "/users/api/v2/register/",
  LOGIN: "/users/api/v2/login/",
  REFRESH_TOKEN: "/users/api/v2/token/refresh/",
  PROFILE: "/users/api/v2/profile/",

  // Groups (Classes)
  GROUPS: "/groups/api/v2/groups/",
  GROUP_DETAIL: (id) => `/groups/api/v2/groups/${id}/`,
  STUDENT_GROUPS: "/groups/api/v2/student-groups/",

  // Classrooms
  CLASSROOMS: "/users/api/v2/classrooms/",
  CLASSROOM_DETAIL: (id) => `/users/api/v2/classrooms/${id}/`,

  // Activities
  ACTIVITIES: "/users/api/v2/activities/",
  ACTIVITY_DETAIL: (id) => `/users/api/v2/activities/${id}/`,

  // Coins
  WALLETS: "/coins/api/v2/wallets/",
  TRANSACTIONS: "/coins/api/v2/transactions/",

  // Auctions
  AUCTIONS: "/auctions/api/v2/auctions/",
  AUCTION_DETAIL: (id) => `/auctions/api/v2/auctions/${id}/`,
  BIDS: "/auctions/api/v2/bids/",
  PLACE_BID: "/auctions/api/bid/",
  CLOSE_AUCTION: (id) => `/auctions/api/${id}/close/`,
  MY_BIDS: "/auctions/api/my-bids/",

  // Notifications
  NOTIFICATIONS: "/notifications/api/v2/notifications/",

  // Reports
  REPORTS: "/reports/api/v2/reports/",
}

export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "docente",
  STUDENT: "estudiante",
}

export const ACTIVITY_STATUS = {
  PENDING: "pendiente",
  COMPLETED: "completado",
  ACTIVE: "activo",
}

export const AUCTION_STATUS = {
  ACTIVE: "activo",
  FINISHED: "finalizado",
  PENDING: "pendiente",
}

export const TRANSACTION_TYPES = {
  EARNED: "ganado",
  SPENT: "gastado",
  ASSIGNED: "asignado",
}
