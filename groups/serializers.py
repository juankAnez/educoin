from rest_framework import serializers
from .models import Group, StudentGroup

class GroupSerializer(serializers.ModelSerializer):
    """Serializer para grupos educativos"""
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = [
            'id', 'name', 'teacher', 'teacher_name', 'max_students', 'coin_limit',
            'start_date', 'end_date', 'is_closed', 'students_count'
        ]
        read_only_fields = ['id', 'teacher', 'teacher_name', 'students_count']
    
    def get_students_count(self, obj):
        """Contar estudiantes en el grupo"""
        return obj.student_groups.count()

class StudentGroupSerializer(serializers.ModelSerializer):
    """Serializer para relación estudiante-grupo"""
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    
    class Meta:
        model = StudentGroup
        fields = [
            'id', 'student', 'group', 'student_name', 'student_email',
            'group_name', 'active'
        ]
        read_only_fields = ['id', 'student_name', 'student_email', 'group_name']