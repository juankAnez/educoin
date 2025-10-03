from django.contrib import admin
from .models import Grade

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'activity', 'student', 'nota', 'retroalimentacion', 'creado')
    search_fields = ('student__email', 'activity__nombre')
    list_filter = ('creado',)
    readonly_fields = ('creado',)
