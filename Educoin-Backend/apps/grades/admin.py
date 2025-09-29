from django.contrib import admin
from .models import Grade

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('student', 'activity', 'nota', 'fecha')
    list_filter = ('activity__tipo', 'fecha')
    search_fields = ('student__email', 'activity__nombre')
    autocomplete_fields = ('student', 'activity')
    readonly_fields = ('fecha',)
    