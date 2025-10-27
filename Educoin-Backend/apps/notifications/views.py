from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer, NotificationCreateSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar notificaciones.
    - Los usuarios solo ven sus propias notificaciones.
    - Los docentes pueden enviar notificaciones a sus estudiantes.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(usuario=user).select_related('usuario')

    @action(detail=False, methods=['get'])
    def no_leidas(self, request):
        """Obtener solo las notificaciones no leídas"""
        notificaciones = self.get_queryset().filter(leida=False)
        serializer = self.get_serializer(notificaciones, many=True)
        return Response({
            'total': notificaciones.count(),
            'notificaciones': serializer.data
        })

    @action(detail=False, methods=['post'])
    def marcar_todas_leidas(self, request):
        """Marcar todas las notificaciones del usuario como leídas"""
        count = self.get_queryset().filter(leida=False).update(leida=True)
        return Response({
            'message': f'{count} notificaciones marcadas como leídas'
        })

    @action(detail=True, methods=['post'])
    def marcar_leida(self, request, pk=None):
        """Marcar una notificación específica como leída"""
        notificacion = self.get_object()
        notificacion.marcar_como_leida()
        return Response({
            'message': 'Notificación marcada como leída',
            'notificacion': self.get_serializer(notificacion).data
        })

    @action(detail=False, methods=['delete'])
    def eliminar_todas(self, request):
        """Eliminar todas las notificaciones del usuario"""
        count, _ = self.get_queryset().delete()
        return Response({
            'message': f'{count} notificaciones eliminadas'
        })

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas de notificaciones"""
        qs = self.get_queryset()
        total = qs.count()
        no_leidas = qs.filter(leida=False).count()
        leidas = qs.filter(leida=True).count()

        por_tipo = {}
        for tipo, label in Notification.TIPO_CHOICES:
            por_tipo[tipo] = qs.filter(tipo=tipo).count()

        return Response({
            'total': total,
            'no_leidas': no_leidas,
            'leidas': leidas,
            'por_tipo': por_tipo
        })