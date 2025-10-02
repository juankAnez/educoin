from rest_framework import serializers
from .models import Activity, Submission

class ActivitySerializer(serializers.ModelSerializer):
    classroom = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = '__all__'

    def get_classroom(self, obj):
        return obj.group.classroom.id if obj.group and obj.group.classroom else None

class SubmissionSerializer(serializers.ModelSerializer):
    estudiante = serializers.PrimaryKeyRelatedField(read_only=True)
    activity = serializers.PrimaryKeyRelatedField(queryset=Activity.objects.all())

    class Meta:
        model = Submission
        fields = [
            'id',
            'activity',
            'estudiante',
            'contenido',
            'fecha_envio',
            'calificacion',
            'retroalimentacion'
        ]
        read_only_fields = ['id', 'fecha_envio', 'calificacion', 'retroalimentacion']

    def validate(self, data):
        user = self.context['request'].user
        activity = data.get('activity')

        # Validar duplicado
        if Submission.objects.filter(activity=activity, estudiante=user).exists():
            raise serializers.ValidationError("Ya has enviado una entrega para esta actividad.")

        # Validar que la actividad esté habilitada
        if not activity.habilitada:
            raise serializers.ValidationError("La actividad no está habilitada para entregas.")

        return data

class SubmissionDetailSerializer(SubmissionSerializer):
    activity = ActivitySerializer(read_only=True)
    estudiante = serializers.StringRelatedField(read_only=True)

    class Meta(SubmissionSerializer.Meta):
        fields = SubmissionSerializer.Meta.fields + ['activity', 'estudiante']
        read_only_fields = SubmissionSerializer.Meta.read_only_fields + ['activity', 'estudiante']
        