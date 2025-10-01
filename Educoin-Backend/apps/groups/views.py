from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from .models import Group
from .serializers import GroupSerializer
from apps.users.permissions import IsDocente

class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            return Group.objects.filter(classroom__docente=user)
        elif user.role == 'estudiante':
            return Group.objects.filter(estudiantes=user)
        return Group.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'add_students']:
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        classroom = serializer.validated_data.get('classroom')
        if user.role != 'docente':
            raise PermissionDenied("No tienes permiso para crear grupos en esta clase.")
        serializer.save()

    @action(detail=False, methods=['post'], url_path='join', permission_classes=[permissions.IsAuthenticated])
    def join_by_code(self, request):
        """
        Endpoint: POST /api/groups/join/
        Body: { "code": "ABC123" }
        Permite a estudiantes unirse a un grupo por código.
        """
        code = request.data.get('code', '').strip().upper()
        if not code:
            raise ValidationError({"code": "Código requerido"})

        try:
            group = Group.objects.get(codigo=code, activo=True)
        except Group.DoesNotExist:
            raise NotFound("Código inválido o grupo no disponible.")

        # validar expiración
        if not group.codigo_valido():
            return Response({"detail": "Código expirado."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.role != 'estudiante':
            return Response({"detail": "Solo estudiantes pueden unirse por código."}, status=status.HTTP_403_FORBIDDEN)

        if group.estudiantes.filter(id=user.id).exists():
            return Response({"detail": "Ya estás inscrito en este grupo."}, status=status.HTTP_200_OK)

        # Añadir estudiante
        group.estudiantes.add(user)
        group.save()

        serializer = self.get_serializer(group, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='join', permission_classes=[permissions.IsAuthenticated])
    def join_detail(self, request, pk=None):
        """También soporta POST /api/groups/<pk>/join/ (opcional)."""
        try:
            group = self.get_object()
        except:
            raise NotFound("Grupo no encontrado.")
        user = request.user
        if user.role != 'estudiante':
            return Response({"detail": "Solo estudiantes pueden unirse por código."}, status=status.HTTP_403_FORBIDDEN)
        if not group.activo:
            return Response({"detail": "Inscripción deshabilitada para este grupo."}, status=status.HTTP_400_BAD_REQUEST)
        if group.estudiantes.filter(id=user.id).exists():
            return Response({"detail": "Ya estás inscrito en este grupo."}, status=status.HTTP_200_OK)
        group.estudiantes.add(user)
        return Response(self.get_serializer(group, context={'request': request}).data, status=status.HTTP_200_OK)
