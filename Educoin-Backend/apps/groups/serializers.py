from rest_framework import serializers
from .models import Group
from apps.users.models import User
from apps.classrooms.models import Classroom

class StudentInGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']


class ClassroomInGroupSerializer(serializers.ModelSerializer):
    """Serializer para mostrar información básica del classroom"""
    class Meta:
        model = Classroom
        fields = ['id', 'nombre', 'descripcion']
        read_only_fields = ['id', 'nombre', 'descripcion']


class GroupSerializer(serializers.ModelSerializer):
    estudiantes = StudentInGroupSerializer(many=True, read_only=True)
    classroom_detail = ClassroomInGroupSerializer(source='classroom', read_only=True)
    student_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='estudiante'),
        many=True,
        write_only=True,
        required=False
    )
    classroom = serializers.PrimaryKeyRelatedField(queryset=Classroom.objects.all())
    
    class Meta:
        model = Group
        fields = [
            'id', 'nombre', 'descripcion', 'classroom', 'classroom_detail',
            'estudiantes', 'student_ids', 'codigo', 'activo', 
            'codigo_generado_en', 'codigo_expira_en', 'creado'
        ]
        read_only_fields = ['creado', 'codigo', 'codigo_generado_en']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        # Agregar información del classroom al nivel principal
        if data.get('classroom_detail'):
            data['classroom_nombre'] = data['classroom_detail']['nombre']
        
        # Mostrar el código solo si el usuario es docente de la clase o es staff
        if request and request.user.is_authenticated:
            if request.user.role == 'docente' and instance.classroom.docente_id == request.user.id:
                pass
            elif request.user.role == 'admin' or request.user.is_staff:
                pass
            else:
                data.pop('codigo', None)
                data.pop('codigo_generado_en', None)
                data.pop('codigo_expira_en', None)
        
        return data

    def create(self, validated_data):
        student_ids = validated_data.pop('student_ids', None)
        group = super().create(validated_data)
        if student_ids:
            group.estudiantes.set(student_ids)
        return group

    def update(self, instance, validated_data):
        student_ids = validated_data.pop('student_ids', None)
        instance = super().update(instance, validated_data)
        if student_ids is not None:
            instance.estudiantes.set(student_ids)
        return instance

    def validate_classroom(self, value):
        user = self.context['request'].user
        if user.role == 'docente' and value.docente != user:
            raise serializers.ValidationError("No puedes asignar un grupo a una clase que no es tuya.")
        return value
    
    def validate_codigo(self, value):
        if value:
            raise serializers.ValidationError("El código se genera automáticamente, no puede ser definido manualmente.")
        return value