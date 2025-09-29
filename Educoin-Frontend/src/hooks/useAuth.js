import { useAuthContext } from "../context/AuthContext"
import { USER_ROLES } from "../utils/constants"

export const useAuth = () => {
  const { user, ...rest } = useAuthContext()

  const isTeacher = user?.role === USER_ROLES.TEACHER
  const isStudent = user?.role === USER_ROLES.STUDENT
  const isAdmin = user?.role === USER_ROLES.ADMIN

  return {
    user,
    isTeacher,
    isStudent,
    isAdmin,
    ...rest,
  }
}
