from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    tiempo_transcurrido = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'usuario', 'usuario_email', 'tipo', 'titulo', 
            'mensaje', 'leida', 'activity_id', 'grade_id', 
            'auction_id', 'metadata', 'creado', 'tiempo_transcurrido'
        ]
        read_only_fields = ['usuario', 'creado']

    def get_tiempo_transcurrido(self, obj):
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.creado

        if diff.days > 0:
            return f"Hace {diff.days} día{'s' if diff.days > 1 else ''}"
        elif diff.seconds >= 3600:
            horas = diff.seconds // 3600
            return f"Hace {horas} hora{'s' if horas > 1 else ''}"
        elif diff.seconds >= 60:
            minutos = diff.seconds // 60
            return f"Hace {minutos} minuto{'s' if minutos > 1 else ''}"
        else:
            return "Hace un momento"


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear notificaciones (solo docentes/admin)"""
    
    class Meta:
        model = Notification
        fields = ['tipo', 'titulo', 'mensaje', 'metadata']