"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "../services/groups"
import { useToast } from "./useToast"

export const useGroups = (params = {}) => {
  return useQuery({
    queryKey: ["groups", params],
    queryFn: () => groupService.getGroups(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useGroup = (id) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => groupService.getGroup(id),
    enabled: !!id,
  })
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: groupService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: "Grupo creado",
        description: "El grupo se ha creado exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }) => groupService.updateGroup(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      queryClient.invalidateQueries({ queryKey: ["groups", variables.id] })
      toast({
        title: "Grupo actualizado",
        description: "El grupo se ha actualizado exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: groupService.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: "Grupo eliminado",
        description: "El grupo se ha eliminado exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useAddStudentToGroup = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ groupId, studentId }) => groupService.addStudentToGroup(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: "Estudiante agregado",
        description: "El estudiante se ha agregado al grupo exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
