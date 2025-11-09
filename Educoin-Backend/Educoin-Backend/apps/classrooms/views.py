from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from .models import Classroom
from .serializers import ClassroomSerializer
from apps.users.models import User
from apps.users.permissions import IsDocente
from apps.users.serializers import UserProfileSerializer


class ClassroomViewSet(viewsets.ModelViewSet):
    """
    - Docentes: pueden crear, ver, actualizar y eliminar SOLO sus propias clases.
    - Estudiantes: pueden ver las clases en las que están inscritos.
    - Otros roles: sin acceso.
    """
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"], url_path="students")
    def students(self, request, pk=None):
        """
        Devuelve todos los estudiantes de los grupos pertenecientes a esta clase.
        """
        classroom = self.get_object()
        students = User.objects.filter(groups__classroom=classroom, role="estudiante").distinct()
        serializer = UserProfileSerializer(students, many=True, context={"request": request})
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            return Classroom.objects.filter(docente=user).prefetch_related("grupos_clases")
        elif user.role == 'estudiante':
            return Classroom.objects.filter(grupos_clases__estudiantes=user).distinct().select_related("docente")
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
        serializer.save(docente=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.docente != self.request.user:
            raise PermissionDenied("No puedes editar una clase que no es tuya.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.docente != self.request.user:
            raise PermissionDenied("No puedes eliminar una clase que no es tuya.")
        instance.delete()
