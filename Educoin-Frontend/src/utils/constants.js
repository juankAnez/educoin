export const API_BASE_URL = "http://localhost:8000"

export const API_ENDPOINTS = {
  // Auth
  REGISTER: "/api/users/register/",
  LOGIN: "/api/users/login/",
  PROFILE: "/api/users/profile/",

  // Groups (Classes)
  GROUPS: "/api/groups/",
  GROUP_DETAIL: (id) => `/api/groups/${id}/`,
  //STUDENT_GROUPS: "/api/student-groups/",

  // Classrooms
  CLASSROOMS: "/api/classrooms/",
  CLASSROOM_DETAIL: (id) => `/api/classrooms/${id}/`,

  // Activities
  ACTIVITIES: "/api//activities/",
  ACTIVITY_DETAIL: (id) => `/api/activities/${id}/`,

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
