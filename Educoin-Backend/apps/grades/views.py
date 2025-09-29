from rest_framework import viewsets, permissions
from .models import Grade
from .serializers import GradeSerializer
from apps.users.permissions import IsDocente, IsEstudiante

class GradeViewSet(viewsets.ModelViewSet):
    """
    - Docentes pueden asignar y editar notas.
    - Estudiantes pueden ver solo sus notas.
    """
    serializer_class = GradeSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            return Grade.objects.filter(activity__classroom__docente=user)
        elif user.role == 'estudiante':
            return Grade.objects.filter(student=user)
        return Grade.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # docente asigna la nota al estudiante
        activity = serializer.validated_data.get('activity')
        if activity.classroom.docente != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No puedes calificar actividades que no son tuyas.")
        serializer.save()
