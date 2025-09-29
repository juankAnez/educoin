from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('classroom', 'tipo', 'group', 'habilitada', 'fecha_entrega', 'valor_educoins', 'valor_notas')
    list_filter = ('tipo', 'habilitada', 'group')
    search_fields = ('nombre', 'descripcion')
