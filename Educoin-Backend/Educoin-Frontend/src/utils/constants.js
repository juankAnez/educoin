export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/users/login/",
  REGISTER: "/api/users/register/",
  PROFILE: "/api/users/profile/",
  PROFILE_UPDATE: "/api/users/profile/update/",
  GOOGLE_LOGIN: "/api/users/google/",
  CHANGE_PASSWORD: "/api/users/change-password/",
  PASSWORD_RESET: "/api/users/password-reset/",
  
  // Classrooms (ViewSet RESTful)
  CLASSROOMS: "/api/classrooms/",
  CLASSROOM_DETAIL: (id) => `/api/classrooms/${id}/`,
  CLASSROOM_STUDENTS: (id) => `/api/classrooms/${id}/students/`,
  
  // Groups (ViewSet RESTful)
  GROUPS: "/api/groups/",
  GROUP_DETAIL: (id) => `/api/groups/${id}/`,
  GROUP_JOIN_BY_CODE: "/api/groups/join/", // POST con {code}
  GROUP_JOIN_BY_ID: (id) => `/api/groups/${id}/join/`, // POST directo
  
  // Activities
  ACTIVITIES: "/api/activities/",
  ACTIVITY_DETAIL: (id) => `/api/activities/${id}/`,
  
  // Submissions
  SUBMISSIONS: "/api/submissions/",
  SUBMISSION_DETAIL: (id) => `/api/submissions/${id}/`,
  SUBMISSION_GRADE: (id) => `/api/submissions/${id}/grade/`,
  
  // Grades
  GRADES: "/api/grades/",
  GRADE_DETAIL: (id) => `/api/grades/${id}/`,
  
  // Coins/Wallet
  WALLET: "/api/coins/wallet/",
  WALLETS: "/api/coins/wallets/",
  TRANSACTIONS: "/api/coins/transactions/",
  PERIODS: "/api/coins/periods/",
  
  // Auctions
  AUCTIONS: "/api/auctions/",
  AUCTION_DETAIL: (id) => `/api/auctions/${id}/`,
  AUCTION_PLACE_BID: (id) => `/api/auctions/${id}/place-bid/`,
  AUCTION_CLOSE: (id) => `/api/auctions/auctions/${id}/close/`,
  AUCTION_BIDS: (id) => `/api/auctions/${id}/bids/`,
  
  // Notifications
  NOTIFICATIONS: "/api/notifications/",
  NOTIFICATION_DETAIL: (id) => `/api/notifications/${id}/`,
  NOTIFICATIONS_MARK_ALL_READ: "/api/notifications/mark_all_read/",
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "docente",
  STUDENT: "estudiante",
};

// Estados de actividades
export const ACTIVITY_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  GRADED: "graded",
};

// Estados de subastas
export const AUCTION_STATUS = {
  ACTIVE: "active",
  FINISHED: "finished",
  UPCOMING: "upcoming",
};

// Colores del tema
export const THEME = {
  PRIMARY: "#f97316", // naranja Educoin
  PRIMARY_DARK: "#ea580c",
  SECONDARY: "#3b82f6", // azul
  BACKGROUND: "#f9fafb",
  CARD: "#ffffff",
  TEXT: "#111827",
  MUTED: "#6b7280",
};