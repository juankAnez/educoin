export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  LOGIN: "/api/users/login/",
  REGISTER: "/api/users/register/",
  PROFILE: "/api/users/profile/",
  CLASSROOMS: "/api/classrooms/",
  GROUPS: "/api/groups/",
  GROUP_JOIN: (code) => `/api/groups/join/${code}/`,
  ACTIVITIES: "/api/activities/",
  ACTIVITY_DETAIL: (id) => `/api/activities/${id}/`,
  AUCTIONS: "/api/auctions/",
  AUCTION_DETAIL: (id) => `/api/auctions/${id}/`,
  COINS: "/api/coins/",
  WALLET: "/api/coins/wallet/",
  TRANSACTIONS: "/api/coins/transactions/",
  SUBMISSIONS: "/api/submissions/",
  SUBMISSION_GRADE: (id) => `/api/submissions/${id}/grade/`,
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "docente",
  STUDENT: "estudiante",
}

// Estados de actividades
export const ACTIVITY_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  GRADED: "graded",
}

// Estados de subastas
export const AUCTION_STATUS = {
  ACTIVE: "active",
  FINISHED: "finished",
  UPCOMING: "upcoming",
}

// Colores o temas base (opcional)
export const THEME = {
  PRIMARY: "#f97316", // naranja tipo educoin
  BACKGROUND: "#f9fafb",
}
