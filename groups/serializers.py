from rest_framework import serializers
from .models import Group, StudentGroup
from users.models import User

class GroupSerializer(serializers.ModelSerializer):
    """Serializer para grupos educativos"""
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'subject', 'teacher', 'teacher_name', 
                 'students_count', 'created_at']
        read_only_fields = ['id', 'created_at', 'teacher']
    
    def get_students_count(self, obj):
        """Contar estudiantes en el grupo"""
        return obj.studentgroup_set.count()

class StudentGroupSerializer(serializers.ModelSerializer):
    """Serializer para relación estudiante-grupo"""
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    
    class Meta:
        model = StudentGroup
        fields = ['id', 'student', 'group', 'student_name', 'student_email', 
                 'group_name', 'joined_at']
        read_only_fields = ['id', 'joined_at']

class AddStudentToGroupSerializer(serializers.Serializer):
    """Serializer para agregar estudiante a grupo"""
    student_email = serializers.EmailField()
    group_id = serializers.IntegerField()
    
    def validate_student_email(self, value):
        """Validar que el estudiante exista"""
        try:
            student = User.objects.get(email=value, role='student')
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Estudiante no encontrado")
    
    def validate_group_id(self, value):
        """Validar que el grupo exista y pertenezca al profesor"""
        request = self.context.get('request')
        try:
            group = Group.objects.get(id=value, teacher=request.user)
            return value
        except Group.DoesNotExist:
            raise serializers.ValidationError("Grupo no encontrado o no autorizado")