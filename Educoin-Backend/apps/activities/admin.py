from django.contrib import admin
from .models import Activity, Submission

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo', 'group', 'fecha_entrega', 'habilitada', 'valor_educoins', 'valor_notas', 'creada')
    search_fields = ('nombre', 'descripcion')
    list_filter = ('tipo', 'habilitada', 'fecha_entrega', 'group')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('activity', 'estudiante', 'fecha_envio', 'calificacion')
    search_fields = ('activity__nombre', 'estudiante__username', 'estudiante__email')
    list_filter = ('fecha_envio', 'calificacion')
