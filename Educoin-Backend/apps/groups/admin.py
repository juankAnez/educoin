from django.contrib import admin
from .models import Group

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'classroom', 'creado')
    list_filter = ('classroom',)
    search_fields = ('nombre', 'descripcion')
    ordering = ('-creado',)
    filter_horizontal = ('estudiantes',)  # widget múltiple para seleccionar estudiantes
