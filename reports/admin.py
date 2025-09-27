from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_by', 'report_type', 'created_at', 'file')
    list_filter = ('report_type', 'created_at')
    search_fields = ('created_by__email', 'description')
