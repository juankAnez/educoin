import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { classroomService } from "../services/classrooms"
import toast from "react-hot-toast"

export const useClassrooms = () => {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: classroomService.getClassrooms,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useClassroom = (id) => {
  return useQuery({
    queryKey: ["classroom", id],
    queryFn: () => classroomService.getClassroom(id),
    enabled: !!id,
  })
}

export const useCreateClassroom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classroomService.createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      toast.success("Clase creada exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => classroomService.updateClassroom(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      queryClient.invalidateQueries({ queryKey: ["classroom", variables.id] })
      toast.success("Clase actualizada exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classroomService.deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      toast.success("Clase eliminada exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useJoinClassroom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: classroomService.joinClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      toast.success("Te has unido a la clase exitosamente")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useClassroomStudents = (id) => {
  return useQuery({
    queryKey: ["classroom-students", id],
    queryFn: () => classroomService.getClassroomStudents(id),
    enabled: !!id,
  })
}
