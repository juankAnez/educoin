from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Classroom
from .serializers import ClassroomSerializer
from apps.users.permissions import IsDocente


class ClassroomViewSet(viewsets.ModelViewSet):
    """
    - Docentes: pueden crear, ver, actualizar y eliminar SOLO sus propias clases.
    - Estudiantes: pueden ver las clases en las que están inscritos.
    - Otros roles: sin acceso.
    """
    serializer_class = ClassroomSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            # Clases creadas por este docente
            return Classroom.objects.filter(docente=user)
        elif user.role == 'estudiante':
            # Clases en las que el estudiante esté inscrito
            return Classroom.objects.filter(groups__students=user).distinct()
        return Classroom.objects.none()

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
        Forzamos que el docente actual quede como dueño de la clase.
        """
        serializer.save(docente=self.request.user)

    def perform_update(self, serializer):
        """
        Docente solo puede actualizar su propia clase.
        """
        instance = self.get_object()
        if instance.docente != self.request.user:
            raise PermissionDenied("No puedes editar una clase que no es tuya.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.docente != self.request.user:
            raise PermissionDenied("No puedes eliminar una clase que no es tuya.")
        instance.delete()
