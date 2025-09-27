from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'created_by', 'created_by_email', 'report_type', 'description', 'created_at', 'file']
        read_only_fields = ['id', 'created_by_email', 'created_at']
