from rest_framework import serializers
from .models import Group
from apps.users.models import User


class StudentInGroupSerializer(serializers.ModelSerializer):
    """Para mostrar datos básicos de cada estudiante dentro del grupo"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role']


class GroupSerializer(serializers.ModelSerializer):
    """
    - Muestra info básica del grupo.
    - Lista los estudiantes con datos básicos.
    """
    students = StudentInGroupSerializer(many=True, read_only=True)
    # Para asignar estudiantes vía IDs (si quisieras desde API)
    student_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='estudiante'),
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'classroom', 'students', 'student_ids']

    def create(self, validated_data):
        student_ids = validated_data.pop('student_ids', [])
        group = Group.objects.create(**validated_data)
        if student_ids:
            group.students.set(student_ids)
        return group

    def update(self, instance, validated_data):
        student_ids = validated_data.pop('student_ids', None)
        instance = super().update(instance, validated_data)
        if student_ids is not None:
            instance.students.set(student_ids)
        return instance
