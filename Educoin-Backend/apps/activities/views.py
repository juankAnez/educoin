from rest_framework import viewsets, permissions
from .models import Activity
from .serializers import ActivitySerializer
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
            return Activity.objects.filter(classroom__docente=user)
        elif user.role == 'estudiante':
            return Activity.objects.filter(
                group__estudiantes=user, habilitada=True
            )
        return Activity.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # validar que la clase pertenece al docente actual
        classroom = serializer.validated_data.get('classroom')
        if classroom.docente != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No puedes crear actividades en clases que no te pertenecen.")
        serializer.save()
