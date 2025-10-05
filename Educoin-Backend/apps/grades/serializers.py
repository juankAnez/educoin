from rest_framework import serializers
from .models import Grade


class GradeSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(source="student.email", read_only=True)
    activity_nombre = serializers.CharField(source="activity.nombre", read_only=True)

    class Meta:
        model = Grade
        fields = [
            "id", "activity", "activity_nombre", "student", "student_email",
            "nota", "retroalimentacion", "creado"
        ]
