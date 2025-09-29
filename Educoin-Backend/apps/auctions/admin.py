from django.contrib import admin
from .models import Auction, Bid

@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):
    list_display = ("titulo", "creador", "periodo", "estado", "fecha_inicio", "fecha_fin")
    list_filter = ("estado", "periodo")


@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ("auction", "estudiante", "cantidad", "creado")
    search_fields = ("estudiante__email",)
