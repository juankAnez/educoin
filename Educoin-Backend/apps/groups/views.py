from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Group
from .serializers import GroupSerializer
from apps.users.permissions import IsDocente


class GroupViewSet(viewsets.ModelViewSet):
    """
    - Docentes: pueden crear/editar/eliminar grupos SOLO dentro de sus clases.
    - Estudiantes: pueden ver los grupos a los que pertenecen.
    - Otros roles: sin acceso.
    """
    serializer_class = GroupSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            # Todos los grupos de las clases de este docente
            return Group.objects.filter(classroom__docente=user)
        elif user.role == 'estudiante':
            # Grupos en los que esté inscrito el estudiante
            return Group.objects.filter(estudiantes=user)
        return Group.objects.none()

    def get_permissions(self):
        """
        Docente autenticado para crear/editar/eliminar,
        cualquier autenticado para lectura.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        Aseguramos que el docente solo cree grupos dentro de SUS clases.
        """
        classroom = serializer.validated_data.get('classroom')
        if classroom.docente != self.request.user:
            raise PermissionDenied("No puedes crear un grupo en una clase que no es tuya.")
        serializer.save()

    def perform_update(self, serializer):
        """
        Docente solo puede actualizar grupos de sus propias clases.
        """
        group = self.get_object()
        if group.classroom.docente != self.request.user:
            raise PermissionDenied("No puedes editar un grupo que no es tuyo.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.classroom.docente != self.request.user:
            raise PermissionDenied("No puedes eliminar un grupo que no es tuyo.")
        instance.delete()
