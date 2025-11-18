from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer para notificaciones - usando los nombres en español del modelo
    """
    tiempo_desde = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'tipo',
            'titulo',
            'mensaje',
            'leida',
            'activity_id',
            'grade_id', 
            'auction_id',
            'metadata',
            'creado',
            'tiempo_desde'
        ]
        read_only_fields = ['id', 'creado']
    
    def get_tiempo_desde(self, obj):
        """
        Retorna el tiempo transcurrido desde la creación en formato legible
        """
        from django.utils.timesince import timesince
        return timesince(obj.creado)


class NotificationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear notificaciones (docentes a estudiantes)
    """
    class Meta:
        model = Notification
        fields = [
            'usuario',
            'tipo', 
            'titulo',
            'mensaje',
            'activity_id',
            'grade_id',
            'auction_id',
            'metadata'
        ]