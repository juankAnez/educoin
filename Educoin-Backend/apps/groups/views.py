from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from apps.groups.models import Group
from apps.groups.serializers import GroupSerializer
from apps.coins.models import Wallet, Period
from apps.users.permissions import IsDocente

class GroupViewSet(viewsets.ModelViewSet):
    """
    Gestiona los grupos de clase:
    - Los docentes pueden crear grupos.
    - Los estudiantes pueden unirse por código o por ID.
    - Los periodos deben ser creados manualmente por el docente después de crear el grupo.
    - Al unirse un estudiante, se le genera su wallet para el periodo activo (si existe).
    """
    serializer_class = GroupSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return Group.objects.all()
        if user.role == 'docente':
            return Group.objects.filter(classroom__docente=user)
        elif user.role == 'estudiante':
            return Group.objects.filter(estudiantes=user)
        return Group.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @transaction.atomic
    def perform_create(self, serializer):
        """
        Al crear un grupo:
        - Se valida que el usuario sea docente.
        - NO se crean periodos automáticamente (el docente los crea después).
        """
        user = self.request.user
        classroom = serializer.validated_data.get('classroom')

        if user.role != 'docente':
            raise PermissionDenied("No tienes permiso para crear grupos en esta clase.")
        if classroom.docente != user:
            raise PermissionDenied("No puedes crear grupos en clases de otros docentes.")

        group = serializer.save()
        # Ya no creamos periodos automáticamente aquí

    # -------------------------------
    # JOIN POR CÓDIGO
    # -------------------------------
    @action(detail=False, methods=['post'], url_path='join', permission_classes=[permissions.IsAuthenticated])
    @transaction.atomic
    def join_by_code(self, request):
        """
        Endpoint: POST /api/groups/join/
        Body: { "code": "ABC123" }
        El estudiante se une a un grupo por código y se le crea una wallet
        en el periodo activo del grupo (si existe).
        """
        code = request.data.get('code', '').strip().upper()
        if not code:
            raise ValidationError({"code": "Código requerido."})

        try:
            group = Group.objects.get(codigo=code, activo=True)
        except Group.DoesNotExist:
            raise NotFound("Código inválido o grupo no disponible.")

        if not group.codigo_valido():
            return Response({"detail": "Código expirado."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.role != 'estudiante':
            return Response({"detail": "Solo estudiantes pueden unirse por código."}, status=status.HTTP_403_FORBIDDEN)

        if group.estudiantes.filter(id=user.id).exists():
            return Response({"detail": "Ya estás inscrito en este grupo."}, status=status.HTTP_200_OK)

        # --- 1. Añadir estudiante al grupo ---
        group.estudiantes.add(user)

        # --- 2. Crear wallet para el periodo activo (si existe) ---
        periodo_activo = Period.objects.filter(grupo=group, activo=True).first()
        wallet_creada = False

        if periodo_activo:
            Wallet.objects.get_or_create(
                usuario=user,
                grupo=group,
                periodo=periodo_activo,
                defaults={"saldo": 0, "bloqueado": 0}
            )
            wallet_creada = True

        serializer = self.get_serializer(group, context={'request': request})
        return Response({
            "mensaje": "Te has unido al grupo correctamente.",
            "grupo": serializer.data,
            "wallet_creada": wallet_creada,
            "periodo_activo": periodo_activo.nombre if periodo_activo else None
        }, status=status.HTTP_200_OK)

    # -------------------------------
    # JOIN POR ID DIRECTO
    # -------------------------------
    @action(detail=True, methods=['post'], url_path='join', permission_classes=[permissions.IsAuthenticated])
    @transaction.atomic
    def join_detail(self, request, pk=None):
        """
        Endpoint: POST /api/groups/<id>/join/
        Permite unirse directamente al grupo por su ID.
        """
        try:
            group = self.get_object()
        except Group.DoesNotExist:
            raise NotFound("Grupo no encontrado.")

        user = request.user
        if user.role != 'estudiante':
            return Response({"detail": "Solo estudiantes pueden unirse a grupos."}, status=status.HTTP_403_FORBIDDEN)
        if not group.activo:
            return Response({"detail": "Inscripción deshabilitada para este grupo."}, status=status.HTTP_400_BAD_REQUEST)
        if group.estudiantes.filter(id=user.id).exists():
            return Response({"detail": "Ya estás inscrito en este grupo."}, status=status.HTTP_200_OK)

        # --- 1. Añadir estudiante ---
        group.estudiantes.add(user)

        # --- 2. Crear wallet por grupo y periodo activo (si existe) ---
        periodo_activo = Period.objects.filter(grupo=group, activo=True).first()
        wallet_creada = False

        if periodo_activo:
            Wallet.objects.get_or_create(
                usuario=user,
                grupo=group,
                periodo=periodo_activo,
                defaults={"saldo": 0, "bloqueado": 0}
            )
            wallet_creada = True

        return Response({
            "mensaje": "Te has unido correctamente al grupo.",
            "grupo": self.get_serializer(group, context={'request': request}).data,
            "wallet_creada": wallet_creada,
            "periodo_activo": periodo_activo.nombre if periodo_activo else None
        }, status=status.HTTP_200_OK)