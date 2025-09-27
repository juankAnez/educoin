from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'user_email', 'title', 'message', 'created_at', 'read', 'type']
        read_only_fields = ['id', 'user_email', 'created_at']
