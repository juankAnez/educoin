from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from django.db import IntegrityError
from .models import Activity, Submission
from .serializers import ActivitySerializer, SubmissionSerializer, SubmissionDetailSerializer
from apps.users.permissions import IsDocente, IsEstudiante

class ActivityViewSet(viewsets.ModelViewSet):
    """
    - Docentes pueden crear/editar actividades en sus clases.
    - Estudiantes solo ven actividades habilitadas de sus grupos/clases.
    """
    serializer_class = ActivitySerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            # Filtrar actividades por los grupos que pertenecen a clases de este docente
            return Activity.objects.filter(group__classroom__docente=user)
        elif user.role == 'estudiante':
            # Solo actividades habilitadas en los grupos donde el estudiante está inscrito
            return Activity.objects.filter(group__estudiantes=user, habilitada=True)
        return Activity.objects.none()


    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        group = serializer.validated_data.get('group')
        if group.classroom.docente != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No puedes crear actividades en grupos que no te pertenecen.")
        serializer.save()

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'estudiante':
            return Submission.objects.filter(estudiante=user)
        elif user.role == 'docente':
            return Submission.objects.filter(activity__group__classroom__docente=user)
        return Submission.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsEstudiante]
        elif self.action == 'grade':
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'estudiante':
            raise PermissionDenied("Solo estudiantes pueden enviar entregas.")
        serializer.save(estudiante=user)

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return SubmissionDetailSerializer
        return SubmissionSerializer
