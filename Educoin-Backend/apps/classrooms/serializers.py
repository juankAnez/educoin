from rest_framework import serializers
from .models import Classroom
from apps.groups.serializers import GroupSerializer

class ClassroomSerializer(serializers.ModelSerializer):
    grupos_clases = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Classroom
        fields = ['id', 'nombre', 'descripcion', 'docente', 'grupos_clases', 'creado']
        read_only_fields = ['id', 'docente', 'creado']