from rest_framework import serializers
from .models import Classroom
from apps.groups.models import Group
from apps.groups.serializers import GroupSerializer


class ClassroomSerializer(serializers.ModelSerializer):
    """
    - Muestra los grupos asociados a la clase con sus estudiantes.
    - El docente se asigna automáticamente en la view.
    """
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'description', 'docente', 'groups']
        read_only_fields = ['docente']  # Para no sobreescribir el docente desde el body
