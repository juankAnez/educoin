from django.contrib import admin
from .models import User, Classroom, Activity, CoinTransaction, Auction, Bid

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'username')

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'docente', 'creado')
    list_filter = ('docente',)
    search_fields = ('nombre', 'docente__email')
    filter_horizontal = ('estudiantes',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'classroom', 'tipo', 'valor_educoins', 'fecha_entrega', 'creado')
    list_filter = ('tipo', 'classroom')
    search_fields = ('nombre', 'classroom__nombre')

@admin.register(CoinTransaction)
class CoinTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'estudiante', 'actividad', 'cantidad', 'motivo', 'fecha')
    list_filter = ('actividad', 'estudiante')
    search_fields = ('estudiante__email', 'motivo')

@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'classroom', 'docente', 'premio', 'fecha_inicio', 'fecha_fin', 'activa', 'ganador')
    list_filter = ('classroom', 'docente', 'activa')
    search_fields = ('titulo', 'premio', 'docente__email')

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ('id', 'auction', 'estudiante', 'cantidad', 'fecha')
    list_filter = ('auction', 'estudiante')
    search_fields = ('auction__titulo', 'estudiante__email')