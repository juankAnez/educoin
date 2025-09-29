"use client"

import { useParams, Link } from "react-router-dom"
import {
  ArrowLeftIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
} from "@heroicons/react/24/outline"
import { useClassroom, useClassroomStudents } from "../../hooks/useClassrooms"
import { useAuth } from "../../hooks/useAuth"
import { formatDate } from "../../utils/helpers"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const ClassroomDetailPage = () => {
  const { id } = useParams()
  const { isTeacher } = useAuth()
  const { data: classroom, isLoading: classroomLoading, error: classroomError } = useClassroom(id)
  const { data: students, isLoading: studentsLoading } = useClassroomStudents(id)

  if (classroomLoading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (classroomError || !classroom) {
    return (
      <div className="text-center py-12 bg-background min-h-screen">
        <p className="text-destructive">Error al cargar la clase: {classroomError?.message}</p>
        <Link to="/classrooms" className="btn-primary mt-4">
          Volver a Clases
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-background min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/classrooms" className="p-2 hover:bg-card rounded-lg transition">
            <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{classroom.name}</h1>
            <p className="text-muted-foreground">Código: {classroom.code}</p>
          </div>
        </div>
        {isTeacher && (
          <button className="btn-outline">
            <CogIcon className="h-5 w-5 mr-2" />
            Configurar
          </button>
        )}
      </div>

      {/* Classroom Info */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Descripción</h3>
            <p className="text-muted-foreground">{classroom.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Información</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <UserGroupIcon className="h-4 w-4 mr-2" />
                <span>{students?.length || 0} estudiantes</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Creada el {formatDate(classroom.created_at)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                <span>0 actividades</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Estado</h3>
            <span className={`badge ${classroom.is_active ? "badge-success" : "badge-error"}`}>
              {classroom.is_active ? "Activa" : "Inactiva"}
            </span>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Estudiantes</h2>
          {isTeacher && <button className="btn-outline text-sm">Invitar Estudiantes</button>}
        </div>

        {studentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : students?.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.first_name?.charAt(0)}
                      {student.last_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">0 Educoins</p>
                  <p className="text-xs text-muted-foreground">0 actividades completadas</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <UserGroupIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">No hay estudiantes aún</h3>
            <p className="text-muted-foreground mb-4">
              {isTeacher
                ? "Comparte el código de la clase para que los estudiantes se unan"
                : "Sé el primero en unirte a esta clase"}
            </p>
            {isTeacher && (
              <div className="bg-secondary rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-muted-foreground mb-2">Código de la clase:</p>
                <p className="text-2xl font-bold text-primary">{classroom.code}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activities Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Actividades</h2>
          {isTeacher && (
            <Link to={`/activities?classroom=${id}`} className="btn-primary text-sm">
              Nueva Actividad
            </Link>
          )}
        </div>
        <div className="text-center py-8">
          <ClipboardDocumentListIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No hay actividades aún</h3>
          <p className="text-muted-foreground">
            {isTeacher ? "Crea la primera actividad para esta clase" : "El profesor aún no ha creado actividades"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClassroomDetailPage
